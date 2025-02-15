import * as assert from 'assert';
import { generateDocumentationUrl } from '../link-generator';

suite('Generate Terraform Documentation Url Unit Tests', () => {

	// Official
	test('aws', () => {
		assert.strictEqual(
			generateDocumentationUrl("aws_instance"),
			"https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance"
		);
	});

	test('google', () => {
		assert.strictEqual(
			generateDocumentationUrl("google_compute_instance"),
			"https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_instance"
		);
	});

	test('azurerm', () => {
		assert.strictEqual(
			generateDocumentationUrl("azurerm_virtual_machine"),
			"https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine"
		);
	});

	test('kubernetes_pod', () => {
		assert.strictEqual(
			generateDocumentationUrl("kubernetes_pod"),
			"https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/pod"
		);
	});

	test('null', () => {
		assert.strictEqual(
			generateDocumentationUrl("null_resource"),
			"https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource"
		);
	});

	// Partner/Community

	test('gitlab', () => {
		assert.strictEqual(
			generateDocumentationUrl("gitlab_project"),
			"https://registry.terraform.io/providers/gitlabhq/gitlab/latest/docs/resources/project"
		);
	});

	test('github', () => {
		assert.strictEqual(
			generateDocumentationUrl("github_repository"),
			"https://registry.terraform.io/providers/integrations/github/latest/docs/resources/repository"
		);
	});
});
