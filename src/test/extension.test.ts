import * as assert from 'assert';
import { generateDocumentationUrl } from '../link-generator';

suite('Generate Terraform Documentation Url Unit Tests', () => {
	suite('Official providers', () => {
		const testCases = {
			"aws_instance": "https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance",
			"google_compute_instance": "https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance",
			"azurerm_virtual_machine": "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine",
			"kubernetes_pod": "https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/pod",
		};

		for (const [key, value] of Object.entries(testCases)) {
			test(key, () => {
				assert.strictEqual(
					generateDocumentationUrl(key, {}), value
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
					generateDocumentationUrl(key, {}), value
				);
			});
		};
	});

	suite('Unofficial providers not included in default provider or included in override setting fallback to assuming official provider', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl("aquasec_image", {}), "https://registry.terraform.io/providers/hashicorp/aquasec/latest/docs/resources/image"
			);
		});
	});

	suite('Unofficial providers not included in default provider but included in override setting', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl("aquasec_image", { "aquasec": "aquasecurity/aquasec" }), "https://registry.terraform.io/providers/aquasecurity/aquasec/latest/docs/resources/image"
			);
		});
	});

	suite('Unofficial providers included in default provider and included in override setting give preference to user setting', () => {
		test("aquasecurity", () => {
			assert.strictEqual(
				generateDocumentationUrl("gitlab_project", { "gitlab": "gitlabhq/gitlab-beta" }), "https://registry.terraform.io/providers/gitlabhq/gitlab-beta/latest/docs/resources/project"
			);
		});
	});
});
