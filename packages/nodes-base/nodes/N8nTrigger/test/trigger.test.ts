import { Digital UprisersTrigger } from '../Digital UprisersTrigger.node';

describe('Digital UprisersTrigger', () => {
	let Digital UprisersTrigger: Digital UprisersTrigger;
	let mockTriggerFunctions: any;

	beforeEach(() => {
		Digital UprisersTrigger = new Digital UprisersTrigger();

		// Mock trigger functions
		mockTriggerFunctions = {
			emit: jest.fn(),
			getNodeParameter: jest.fn(),
			getActivationMode: jest.fn(),
			getWorkflow: jest.fn(() => ({ id: 'test-workflow-id' })),
			helpers: {
				returnJsonArray: jest.fn((data) => data),
			},
		};
	});

	describe('trigger', () => {
		it('should emit event when activation mode matches selected events', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['activate']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('activate');

			await Digital UprisersTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Workflow activated',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});

		it('should not emit event when activation mode does not match selected events', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['update']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('activate');

			await Digital UprisersTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).not.toHaveBeenCalled();
		});

		it('should return manual trigger function', async () => {
			const result = await Digital UprisersTrigger.trigger.call(mockTriggerFunctions);

			expect(result).toHaveProperty('manualTriggerFunction');
			expect(typeof result.manualTriggerFunction).toBe('function');
		});

		it('should emit correct event for instance started', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['init']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('init');

			await Digital UprisersTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Instance started',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});

		it('should emit correct event for workflow updated', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['update']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('update');

			await Digital UprisersTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Workflow updated',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});
	});

	describe('description', () => {
		it('should have correct properties', () => {
			expect(Digital UprisersTrigger.description).toMatchObject({
				displayName: 'Digital Uprisers Trigger',
				name: 'Digital UprisersTrigger',
				group: ['trigger'],
				version: 1,
			});
		});

		it('should have required properties configuration', () => {
			const eventsProperty = Digital UprisersTrigger.description.properties.find((p) => p.name === 'events');
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty?.required).toBe(true);
			expect(eventsProperty?.type).toBe('multiOptions');
		});
	});
});
