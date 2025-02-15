import * as vscode from 'vscode';
import * as providerData from '../assets/providers.json';

export function generateDocumentationUrl(resourceType: String) {
  const provider = resourceType.substring(0, resourceType.indexOf('_'));
  const providers = providerData as Record<string, String>;

  const providerPath = providers[provider] as String || `hashicorp/${provider}`;

  return `https://registry.terraform.io/providers/${providerPath}/latest/docs/resources/${resourceType.substring(provider.length + 1, resourceType.length)}`;
}

export class TerraformLinker implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    const documentLinks: vscode.DocumentLink[] = [];
    const regEx = /resource\s+"([^"]+)"\s+"([^"]+)"/g;
    let match;

    while ((match = regEx.exec(document.getText()))) {
      console.log(match);
      const resourceType = match[1];

      const startIndex = match.index + match[0].indexOf(resourceType);
      const endIndex = startIndex + resourceType.length;
      const range = new vscode.Range(document.positionAt(startIndex), document.positionAt(endIndex));

      const uri = vscode.Uri.parse(generateDocumentationUrl(resourceType));
      const link = new vscode.DocumentLink(range, uri);
      documentLinks.push(link);
    }
    return documentLinks;
  }
}