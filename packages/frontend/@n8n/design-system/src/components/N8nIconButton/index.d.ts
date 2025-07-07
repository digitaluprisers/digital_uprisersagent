import { Digital UprisersComponent, Digital UprisersComponentSize } from '../component';
import { ButtonTheme, ButtonType } from '../Digital UprisersButton';

/** Icon Button Component */
export declare class Digital UprisersIconButton extends Digital UprisersComponent {
	/** Button type */
	type: ButtonType;

	/** Button title on hover */
	title: string;

	/** Button size */
	size: Digital UprisersComponentSize | 'xlarge';

	/** Determine whether it's loading */
	loading: boolean;

	/** Disable the button */
	disabled: boolean;

	/** Button icon, accepts an icon name of font awesome icon component */
	icon: string;

	/** Button theme */
	theme: ButtonTheme;
}
