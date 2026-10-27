/**
 * 共享基础类型：跨 Provider 复用的最小类型集合。
 *
 * - `LocalizedText`：Provider/Plugin 契约中允许携带的用户可见文案。
 * - `TranslationValue`：插值变量允许的取值类型。
 * - `MessageRef`：延迟到渲染阶段解析的消息引用。
 */

/** 插值变量允许的取值类型。 */
export type TranslationValue = string | number | boolean | Date;

/** 延迟到渲染阶段解析的消息引用。 */
export interface MessageRef {
	readonly key: string;
	readonly values?: Readonly<Record<string, TranslationValue>>;
	readonly fallback?: string;
}

/** Provider/Plugin 契约中允许携带的用户可见文案。 */
export type LocalizedText = string | MessageRef;
