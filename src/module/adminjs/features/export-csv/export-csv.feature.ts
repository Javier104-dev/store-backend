import importESMModule from '@module/adminjs/utils/import-esm-modules.util';

export const configureExportCsvFeature = async (
  resources,
  dataSource,
  componentLoader,
) => {
  const { default: importExportFeature } = await importESMModule(
    '@adminjs/import-export',
  );

  return resources.map((resource) => {
    const features = resource.features || [];

    return {
      ...resource,
      dataSource,

      features: [
        ...features,
        importExportFeature({
          componentLoader,
        }),
      ],

      options: {
        ...resource.options,
        actions: {
          ...resource.options?.actions,
          import: { isAccessible: false },
        },
      },
    };
  });
};
