import * as vscode from 'vscode';
import * as providerData from '../assets/providers.json';
import * as resourceData from '../assets/resources.json';
import * as dataSourcesData from '../assets/data-sources.json';

const configuration = vscode.workspace.getConfiguration('terraform-documentation-quick-links');
const baseurl = configuration.get('baseurl') as string;

// Mapping of overrides from extension config to handle non default providers and resources/data-sources that do not
// follow the normal url path structure
const overrides: Record<string, Record<string, string>> = {
  provider: providerData,
  resource: resourceData,
  data: dataSourcesData,
};

// The same as the above but from the user settings (takes precedence to the above)
const userOverrides = {
  provider: getJsonConfig("providers"),
  resource: getJsonConfig("resources"),
  data: getJsonConfig("data-sources"),
};

// Mapping between tf keyword and matching url path
const types: Record<string, string> = {
  data: "data-sources",
  resource: "resources"
};

// Utils

function getJsonConfig(name: string) {
  const JSONString = configuration.get(name) as string;

  try {
    if (JSONString) {
      return JSON.parse(JSONString);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error parsing terraform-documentation-quick-links.${name} setting. Please ensure it is valid JSON.`);
    console.error('Error parsing terraform-documentation-quick-links.${name}:', error);
    return {};
  }
}

// Actual logic

export function generateDocumentationUrl(
  baseurl: string,
  type: string,
  resource: string,
  userOverrides: Record<string, Record<string, string>>,
) {
  const provider = resource.substring(0, resource.indexOf('_'));

  const providerPath = userOverrides.provider[provider] as string || overrides.provider[provider] as string || `hashicorp/${provider}`;
  const resourcePath = userOverrides[type][resource] as string || overrides[type][resource] as string || resource.substring(provider.length + 1, resource.length);

  return `${baseurl}/providers/${providerPath}/latest/docs/${types[type]}/${resourcePath}`;
}

export class TerraformLinker implements vscode.DocumentLinkProvider {
  provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
    const documentLinks: vscode.DocumentLink[] = [];

    const regEx = /(resource|data)\s+"([^"]+)"\s+"([^"]+)"/g;
    let match;

    while ((match = regEx.exec(document.getText()))) {
      console.log(match);
      const type = match[1];
      const resource = match[2];

      const startIndex = match.index + match[0].indexOf(resource);
      const endIndex = startIndex + resource.length;
      const range = new vscode.Range(document.positionAt(startIndex), document.positionAt(endIndex));

      const uri = vscode.Uri.parse(
        generateDocumentationUrl(baseurl, type, resource, userOverrides)
      );
      const link = new vscode.DocumentLink(range, uri);
      documentLinks.push(link);
    }
    return documentLinks;
  }
}
