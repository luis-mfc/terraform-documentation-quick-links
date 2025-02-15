import * as vscode from 'vscode';
import * as providerData from '../assets/providers.json';

const configuration = vscode.workspace.getConfiguration('terraform-documentation-quick-links');

function getCustomProviders() {
  const customProvidersJSONString = configuration.get('providers') as string;

  try {
    if (customProvidersJSONString) {
      const customProviders = JSON.parse(customProvidersJSONString);
      return customProviders;
    }
  } catch (error) {
    vscode.window.showErrorMessage('Error parsing terraform-documentation-quick-links.providers setting. Please ensure it is valid JSON.');
    console.error('Error parsing customProvidersJSON:', error);
    return {};
  }
}

export function generateDocumentationUrl(baseurl: String, resourceType: String, customProviders: Record<string, string>) {
  const provider = resourceType.substring(0, resourceType.indexOf('_'));
  const providers = providerData as Record<string, string>;

  const providerPath = customProviders[provider] as string || providers[provider] as string || `hashicorp/${provider}`;

  return `${baseurl}/providers/${providerPath}/latest/docs/resources/${resourceType.substring(provider.length + 1, resourceType.length)}`;
}

export class TerraformLinker implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    const documentLinks: vscode.DocumentLink[] = [];
    const customProviders = getCustomProviders();
    const baseurl = configuration.get('baseurl') as string;

    const regEx = /resource\s+"([^"]+)"\s+"([^"]+)"/g;
    let match;

    while ((match = regEx.exec(document.getText()))) {
      console.log(match);
      const resourceType = match[1];

      const startIndex = match.index + match[0].indexOf(resourceType);
      const endIndex = startIndex + resourceType.length;
      const range = new vscode.Range(document.positionAt(startIndex), document.positionAt(endIndex));

      const uri = vscode.Uri.parse(generateDocumentationUrl(baseurl, resourceType, customProviders));
      const link = new vscode.DocumentLink(range, uri);
      documentLinks.push(link);
    }
    return documentLinks;
  }
}
