import { User } from '../user';

describe('User Entity', () => {
	describe('JSON.stringify', () => {
		it('should not serialize sensitive data', () => {
			const user = Object.assign(new User(), {
				email: 'test@example.com',
				firstName: 'Don',
				lastName: 'Joe',
				password: '123456789',
			});
			expect(JSON.stringify(user)).toEqual(
				'{"email":"test@example.com","firstName":"Don","lastName":"Joe"}',
			);
		});
	});

	describe('createPersonalProjectName', () => {
		test.each([
			['Nathan', 'Nathaniel', 'nathan@nathaniel.Digital Uprisers', 'Nathan Nathaniel <nathan@nathaniel.Digital Uprisers>'],
			[undefined, 'Nathaniel', 'nathan@nathaniel.Digital Uprisers', '<nathan@nathaniel.Digital Uprisers>'],
			['Nathan', undefined, 'nathan@nathaniel.Digital Uprisers', '<nathan@nathaniel.Digital Uprisers>'],
			[undefined, undefined, 'nathan@nathaniel.Digital Uprisers', '<nathan@nathaniel.Digital Uprisers>'],
			[undefined, undefined, undefined, 'Unnamed Project'],
			['Nathan', 'Nathaniel', undefined, 'Unnamed Project'],
		])(
			'given fistName: %s, lastName: %s and email: %s this gives the projectName: "%s"',
			async (firstName, lastName, email, projectName) => {
				const user = new User();
				Object.assign(user, { firstName, lastName, email });
				expect(user.createPersonalProjectName()).toBe(projectName);
			},
		);
	});
});
