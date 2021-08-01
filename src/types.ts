import { PluginPass } from '@babel/core';

export interface PluginOptions {
  /* 是否开启多类名转换 */
  enableMultipleStyle?: boolean;
}

export type ConvertPluginPass = Omit<PluginPass, 'opts'> & {
  opts: PluginOptions;
};
