import * as vscode from 'vscode';
import { TerraformLinker } from './link-generator';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "terraform-documentation-quick-links" is now active!');

	context.subscriptions.push(
		vscode.languages.registerDocumentLinkProvider(
			{ language: 'terraform' }, // Apply to Terraform language files
			new TerraformLinker()
		)
	);
}

export function deactivate() { }
