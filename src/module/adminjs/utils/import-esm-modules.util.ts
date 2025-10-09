const importESMModule = async (packageName: string) => {
  return new Function(`return import('${packageName}')`)();
};

export default importESMModule;
