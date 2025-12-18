import type { Attribute, OptionResult } from "../types/IAttribute.d";
import type { VariantResponse } from "../types/IProduct.d";

export function generateCombinations(attributes: Attribute[]) {
	const result: {
		option1value: string;
		option2value: string;
		option3value: string;
	}[] = [];
	const arr1 = attributes[0]?.values || [""];
	const arr2 = attributes[1]?.values || [""];
	const arr3 = attributes[2]?.values || [""];
	for (let i = 0; i < arr1.length; i++) {
		for (let j = 0; j < arr2.length; j++) {
			for (let k = 0; k < arr3.length; k++) {
				result.push({
					option1value: arr1[i] || "",
					option2value: arr2[j] || "",
					option3value: arr3[k] || "",
				});
			}
		}
	}
	return result;
}
export function isSameVariant(a: OptionResult, b: VariantResponse) {
	let isOption1Same = a.option1value === b.option1value;
	let isOption2Same = a.option2value === b.option2value;
	let isOption3Same = a.option3value === b.option3value;
	if (!a.option1value && !b.option1value) {
		isOption1Same = true;
	}
	if (!a.option2value && !b.option2value) {
		isOption2Same = true;
	}
	if (!a.option3value && !b.option3value) {
		isOption3Same = true;
	}
	return isOption1Same && isOption2Same && isOption3Same;
}

export function isValidVariant(variant: OptionResult) {
	return !!variant.option1value || !!variant.option2value || !!variant.option3value;
}
