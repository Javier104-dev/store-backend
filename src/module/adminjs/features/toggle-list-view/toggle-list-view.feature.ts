import { ComponentLoader, FeatureType, buildFeature } from 'adminjs';
import path from 'path';

interface ToggleListViewFeatureOptions {
  componentLoader: ComponentLoader;
}

const bundleComponent = (loader: ComponentLoader, componentName: string) => {
  const componentPath = path.join(__dirname, `./components/${componentName}`);
  return loader.add(componentName, componentPath);
};

const handler = async (request, response, context) => {
  const { resource } = context;
  const { query = {} } = request;

  const records = await resource._admin.find(query);

  return {
    records,
  };
};

export const toggleListViewFeature = (
  options: ToggleListViewFeatureOptions,
): FeatureType => {
  const { componentLoader } = options;

  const advancedTableEditorComponent = bundleComponent(
    componentLoader,
    'AdvancedTableEditor',
  );

  return buildFeature({
    actions: {
      advancedList: {
        actionType: 'resource',
        icon: 'Table',
        name: 'Table Editor',
        isVisible: true,
        component: advancedTableEditorComponent,
        handler,
      },
    },
  });
};
