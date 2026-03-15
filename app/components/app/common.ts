export interface AppMeta {
  logo: string;
  entry: string;
}

/*
  生成应用的桌面快捷方式
*/
export const createAppMeta = (logo: string, entry: string): AppMeta => {
  return {
    logo,
    entry,
  };
};
