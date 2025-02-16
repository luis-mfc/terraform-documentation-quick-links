import * as assert from 'assert';
import * as vscode from 'vscode';
import { generateDocumentationUrl } from '../link-generator';

const emptyUserOverrides = {
	provider: {},
	resource: {},
	data: {}
};

suite('Generate Terraform Documentation Url Unit Tests', () => {
	suite('Official providers', () => {
		const testCases = {
			aws_instance: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance",
			google_compute_instance: "https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance",
			azurerm_virtual_machine: "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine",
			kubernetes_pod: "https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/pod",
		};

		for (const [key, value] of Object.entries(testCases)) {
			test(key, () => {
				assert.strictEqual(
					generateDocumentationUrl("https://registry.terraform.io", "resource", key, emptyUserOverrides), value
				);
			});
		};
	});

	suite('Unofficial providers included in default provider list', () => {
		const testCases = {
			"gitlab_project": "https://registry.terraform.io/providers/gitlabhq/gitlab/latest/docs/resources/project",
			"github_repository": "https://registry.terraform.io/providers/integrations/github/latest/docs/resources/repository",
		};

		for (const [key, value] of Object.entries(testCases)) {
			test(key, () => {
				assert.strictEqual(
					generateDocumentationUrl("https://registry.terraform.io", "resource", key, emptyUserOverrides), value
				);
			});
		};
	});

	suite('Unofficial providers not included in default provider or included in override setting fallback to assuming official provider', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl("https://registry.terraform.io", "resource", "aquasec_image", emptyUserOverrides), "https://registry.terraform.io/providers/hashicorp/aquasec/latest/docs/resources/image"
			);
		});
	});

	suite('Unofficial providers not included in default providers but included in user override data', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl(
					"https://registry.terraform.io",
					"resource",
					"aquasec_image",
					{ provider: { aquasec: "aquasecurity/aquasec" }, resource: {}, data: {} }
				),
				"https://registry.terraform.io/providers/aquasecurity/aquasec/latest/docs/resources/image"
			);
		});
	});

	suite('Unofficial providers included in default provider and included in user override setting give preference to user setting', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl(
					"https://registry.terraform.io",
					"resource",
					"gitlab_project",
					{ provider: { gitlab: "gitlabhq/gitlab-beta" }, resource: {}, data: {} }
				),
				"https://registry.terraform.io/providers/gitlabhq/gitlab-beta/latest/docs/resources/project"
			);
		});
	});

	suite('Linking to Opentofu docs by changing baseurl setting', () => {
		test("aquasecurity", async () => {
			assert.strictEqual(
				generateDocumentationUrl("https://library.tf", "data", "cloudinit_config", emptyUserOverrides),
				"https://library.tf/providers/hashicorp/cloudinit/latest/docs/data-sources/config"
			);
		});
	});

	suite('Official providers / Data Sources', () => {
		const testCases = {
			aws_instance: "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/instance",
			google_compute_instance: "https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/compute_instance"
		};

		for (const [key, value] of Object.entries(testCases)) {
			test(key, () => {
				assert.strictEqual(
					generateDocumentationUrl("https://registry.terraform.io", "data", key, emptyUserOverrides), value
				);
			});
		};
	});

	suite('Resources in override setting', () => {
		test("google_service_account", () => {
			assert.strictEqual(
				generateDocumentationUrl(
					"https://registry.terraform.io",
					"resource",
					"google_service_account",
					emptyUserOverrides,
				),
				"https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account"
			);
		});
	});

	suite('DataSource in override setting', () => {
		test("google_service_account", () => {
			assert.strictEqual(
				generateDocumentationUrl(
					"https://registry.terraform.io",
					"data",
					"google_project_service",
					emptyUserOverrides,
				),
				"https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/google_project_service"
			);
		});
	});

	suite('DataSource in user override setting', () => {
		test("google_service_account", () => {
			assert.strictEqual(
				generateDocumentationUrl(
					"https://registry.terraform.io",
					"data",
					"google_project_service",
					{ provider: {}, resource: {}, data: { google_project_service: "google_google_project_service" } },
				),
				"https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/google_google_project_service"
			);
		});
	});
});
