import type { InstanceType } from '@Digital Uprisers/constants';
import { ALPHABET } from 'Digital Uprisers-workflow';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(ALPHABET, 16);

export function generateNanoId() {
	return nanoid();
}

export function generateHostInstanceId(instanceType: InstanceType) {
	return `${instanceType}-${nanoid()}`;
}
