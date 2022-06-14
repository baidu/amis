import { SchemaObject } from 'amis/lib/schema';
/**
 * 校验规则类名
 */
export declare enum ValidationGroup {
    Pattern = "\u6587\u672C",
    Number = "\u6570\u5B57",
    Regex = "\u6B63\u5219",
    Others = "\u5176\u4ED6"
}
export interface Validator {
    /**
     * 校验规则名称，英文
     */
    name: string;
    /**
     * 校验规则标题
     */
    label: string;
    /**
     * 校验不通过的提示，没有则表示用户不能自定义配置
     */
    message?: string;
    /**
     * 分类
     */
    group?: string;
    /**
     * 快速编辑的表单
     */
    schema?: SchemaObject[];
    /**
     * 输入类型，true则表示是默认
     */
    tag: Partial<Record<ValidatorTag, ValidTagMatchType>>;
}
declare enum ValidTagMatchType {
    isDefault = 1,
    isMore = 2,
    isBuiltIn = 3
}
export declare const registerValidator: (...config: Array<Validator>) => void;
export declare const getValidatorsByTag: (tag: ValidatorTag) => {
    defaultValidators: Record<string, Validator>;
    moreValidators: Record<string, Validator>;
    builtInValidators: Record<string, Validator>;
};
export declare const getValidator: (name: string) => Validator | undefined;
export declare enum ValidatorTag {
    All = "0",
    Text = "1",
    MultiSelect = "2",
    Check = "3",
    Email = "4",
    Password = "5",
    URL = "6",
    Number = "7",
    File = "8",
    Date = "9",
    Code = "10"
}
export {};
