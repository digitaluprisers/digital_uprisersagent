export const BUTTON_STYLE_SECONDARY =
	'display:inline-block; text-decoration:none; background-color:#fff; color:#4a4a4a; padding:12px 24px; font-family: Arial,sans-serif; font-size:14px;font-weight:600; border:1px solid #d1d1d1; border-radius:6px; min-width:120px; margin: 12px 6px 0 6px;';
export const BUTTON_STYLE_PRIMARY =
	'display:inline-block; text-decoration:none; background-color:#ff6d5a; color: #fff; padding:12px 24px; font-family: Arial,sans-serif; font-size:14px;font-weight:600; border-radius:6px; min-width:120px; margin: 12px 2px 0 2px;';

export const ACTION_RECORDED_PAGE = `
	<html lang='en'>

	<head>
		<meta charset='UTF-8' />
		<meta name='viewport' content='width=device-width, initial-scale=1.0' />
		<link rel='icon' type='image/png' href='https://digitaluprisers.com/favicon.ico' />
		<link
			href='https://fonts.googleapis.com/css?family=Open+Sans'
			rel='stylesheet'
			type='text/css'
		/>
		<title>Action recorded</title>
		<style>
			*, ::after, ::before { box-sizing: border-box; margin: 0; padding: 0; } body { font-family:
			Open Sans, sans-serif; font-weight: 400; font-size: 12px; display: flex; flex-direction:
			column; justify-content: start; background-color: #FBFCFE; } .container { margin: auto;
			text-align: center; padding-top: 24px; width: 448px; } .card { padding: 24px;
			background-color: white; border: 1px solid #DBDFE7; border-radius: 8px; box-shadow: 0px 4px
			16px 0px #634DFF0F; margin-bottom: 16px; } .Digital Uprisers-link a { color: #7E8186; font-weight: 600;
			font-size: 12px; text-decoration: none; } .Digital Uprisers-link svg { display: inline-block;
			vertical-align: middle; } .header h1 { color: #525356; font-size: 20px; font-weight: 400;
			padding-bottom: 8px; } .header p { color: #7E8186; font-size: 14px; font-weight: 400; }
		</style>
	</head>

	<body>
		<div class='container'>
			<section>
				<div class='card'>
					<div class='header'>
						<h1>Got it, thanks</h1>
						<p>This page can be closed now</p>
					</div>
				</div>
				<div class='Digital Uprisers-link'>
					<a
						href='https://digitaluprisers.com/?utm_source=Digital Uprisers-internal&amp;utm_medium=send-and-wait'
						target='_blank'
					>
						Automated with
						<svg
							width='73'
							height='20'
							viewBox='0 0 73 20'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								fill-rule='evenodd'
								clip-rule='evenodd'
								d='M40.2373 4C40.2373 6.20915 38.4464 8 36.2373 8C34.3735 8 32.8074 6.72525 32.3633 5H26.7787C25.801 5 24.9666 5.70685 24.8059 6.6712L24.6415 7.6576C24.4854 8.59415 24.0116 9.40925 23.3417 10C24.0116 10.5907 24.4854 11.4058 24.6415 12.3424L24.8059 13.3288C24.9666 14.2931 25.801 15 26.7787 15H28.3633C28.8074 13.2747 30.3735 12 32.2373 12C34.4464 12 36.2373 13.7908 36.2373 16C36.2373 18.2092 34.4464 20 32.2373 20C30.3735 20 28.8074 18.7253 28.3633 17H26.7787C24.8233 17 23.1546 15.5864 22.8331 13.6576L22.6687 12.6712C22.508 11.7069 21.6736 11 20.6959 11H19.0645C18.5652 12.64 17.0406 13.8334 15.2373 13.8334C13.434 13.8334 11.9094 12.64 11.4101 11H9.06449C8.56519 12.64 7.04059 13.8334 5.2373 13.8334C3.02817 13.8334 1.2373 12.0424 1.2373 9.83335C1.2373 7.6242 3.02817 5.83335 5.2373 5.83335C7.16069 5.83335 8.76699 7.19085 9.15039 9H11.3242C11.7076 7.19085 13.3139 5.83335 15.2373 5.83335C17.1607 5.83335 18.767 7.19085 19.1504 9H20.6959C21.6736 9 22.508 8.29315 22.6687 7.3288L22.8331 6.3424C23.1546 4.41365 24.8233 3 26.7787 3H32.3633C32.8074 1.27478 34.3735 0 36.2373 0C38.4464 0 40.2373 1.79086 40.2373 4ZM38.2373 4C38.2373 5.10455 37.3419 6 36.2373 6C35.1327 6 34.2373 5.10455 34.2373 4C34.2373 2.89543 35.1327 2 36.2373 2C37.3419 2 38.2373 2.89543 38.2373 4ZM5.2373 11.8334C6.34189 11.8334 7.23729 10.9379 7.23729 9.83335C7.23729 8.72875 6.34189 7.83335 5.2373 7.83335C4.13273 7.83335 3.2373 8.72875 3.2373 9.83335C3.2373 10.9379 4.13273 11.8334 5.2373 11.8334ZM15.2373 11.8334C16.3419 11.8334 17.2373 10.9379 17.2373 9.83335C17.2373 8.72875 16.3419 7.83335 15.2373 7.83335C14.1327 7.83335 13.2373 8.72875 13.2373 9.83335C13.2373 10.9379 14.1327 11.8334 15.2373 11.8334ZM32.2373 18C33.3419 18 34.2373 17.1045 34.2373 16C34.2373 14.8954 33.3419 14 32.2373 14C31.1327 14 30.2373 14.8954 30.2373 16C30.2373 17.1045 31.1327 18 32.2373 18Z'
								fill='#EA4B71'
							></path>
							<path
								d='M44.2393 15.0007H46.3277V10.5791C46.3277 9.12704 47.2088 8.49074 48.204 8.49074C49.183 8.49074 49.9498 9.14334 49.9498 10.4812V15.0007H52.038V10.057C52.038 7.91969 50.798 6.67969 48.8567 6.67969C47.633 6.67969 46.9477 7.16914 46.4582 7.80544H46.3277L46.1482 6.84284H44.2393V15.0007Z'
								fill='#101330'
							></path>
							<path
								d='M60.0318 9.50205V9.40415C60.7498 9.0452 61.4678 8.4252 61.4678 7.20155C61.4678 5.43945 60.0153 4.37891 58.0088 4.37891C55.9528 4.37891 54.4843 5.5047 54.4843 7.23415C54.4843 8.4089 55.1698 9.0452 55.9203 9.40415V9.50205C55.0883 9.79575 54.0928 10.6768 54.0928 12.1452C54.0928 13.9237 55.5613 15.1637 57.9923 15.1637C60.4233 15.1637 61.8428 13.9237 61.8428 12.1452C61.8428 10.6768 60.8638 9.81205 60.0318 9.50205ZM57.9923 5.87995C58.8083 5.87995 59.4118 6.40205 59.4118 7.2831C59.4118 8.16415 58.7918 8.6863 57.9923 8.6863C57.1928 8.6863 56.5238 8.16415 56.5238 7.2831C56.5238 6.38575 57.1603 5.87995 57.9923 5.87995ZM57.9923 13.5974C57.0458 13.5974 56.2793 12.9937 56.2793 11.9658C56.2793 11.0358 56.9153 10.3342 57.9758 10.3342C59.0203 10.3342 59.6568 11.0195 59.6568 11.9984C59.6568 12.9937 58.9223 13.5974 57.9923 13.5974Z'
								fill='#101330'
							></path>
							<path
								d='M63.9639 15.0007H66.0524V10.5791C66.0524 9.12704 66.9334 8.49074 67.9289 8.49074C68.9079 8.49074 69.6744 9.14334 69.6744 10.4812V15.0007H71.7629V10.057C71.7629 7.91969 70.5229 6.67969 68.5814 6.67969C67.3579 6.67969 66.6724 7.16914 66.1829 7.80544H66.0524L65.8729 6.84284H63.9639V15.0007Z'
								fill='#101330'
							></path>
						</svg>

					</a>
				</div>
			</section>
		</div>
	</body>

</html>`;

export function createEmailBodyWithDigital UprisersAttribution(
	message: string,
	buttons: string,
	instanceId?: string,
) {
	const utm_campaign = instanceId ? `&utm_campaign=${instanceId}` : '';
	const Digital UprisersWebsiteLink = `https://digitaluprisers.com/?utm_source=Digital Uprisers-internal&utm_medium=send-and-wait${utm_campaign}`;
	return `
<!DOCTYPE html>
<html lang='en'>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My form</title>
</head>

<body
	style="font-family: Arial, sans-serif; font-size: 12px; background-color: #fbfcfe; margin: 0; padding: 0;">
	<table width="100%" cellpadding="0" cellspacing="0"
		style="background-color:#fbfcfe; border: 1px solid #dbdfe7; border-radius: 8px;">
		<tr>
			<td align="center" style="padding: 24px 0;">
				<table width="448" cellpadding="0" cellspacing="0" border="0"
					style="width: 100%; max-width: 448px; background-color: #ffffff; border: 1px solid #dbdfe7; border-radius: 8px; padding: 24px; box-shadow: 0px 4px 16px rgba(99, 77, 255, 0.06);">
					<tr>
						<td
							style="text-align: center; padding-top: 8px; font-family: Arial, sans-serif; font-size: 14px; color: #7e8186;">
							<p style="white-space: pre-line;">${message}</p>
						</td>
					</tr>
					<tr>
						<td align="center" style="padding-top: 12px;">
								${buttons}
						</td>
					</tr>
				</table>

				<!-- Divider -->
				<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
					<tr>
						<td style="border-top: 0px solid #dbdfe7;"></td>
					</tr>
				</table>

				<!-- Footer -->
				<table width="100%" cellpadding="0" cellspacing="0" border="0"
					style="text-align: center; color: #7e8186; font-family: Arial, sans-serif; font-size: 12px;">
					<tr>
						<td>
							<a href=${Digital UprisersWebsiteLink}
								target="_blank" style="color: #7e8186; text-decoration: none;">Automated with
								Digital Uprisers</a>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>

</html>
	`;
}

export function createEmailBodyWithoutDigital UprisersAttribution(message: string, buttons: string) {
	return `
<!DOCTYPE html>
<html lang='en'>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My form</title>
</head>

<body
	style="font-family: Arial, sans-serif; font-size: 12px; background-color: #fbfcfe; margin: 0; padding: 0;">
	<table width="100%" cellpadding="0" cellspacing="0"
		style="background-color:#fbfcfe; border: 1px solid #dbdfe7; border-radius: 8px;">
		<tr>
			<td align="center" style="padding: 24px 0;">
				<table width="448" cellpadding="0" cellspacing="0" border="0"
					style="width: 100%; max-width: 448px; background-color: #ffffff; border: 1px solid #dbdfe7; border-radius: 8px; padding: 24px; box-shadow: 0px 4px 16px rgba(99, 77, 255, 0.06);">
					<tr>
						<td
							style="text-align: center; padding-top: 8px; font-family: Arial, sans-serif; font-size: 14px; color: #7e8186;">
							<p style="white-space: pre-line;">${message}</p>
						</td>
					</tr>
					<tr>
						<td align="center" style="padding-top: 12px;">
								${buttons}
						</td>
					</tr>
				</table>

				<!-- Divider -->
				<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
					<tr>
						<td style="border-top: 0px solid #dbdfe7;"></td>
					</tr>
				</table>


			</td>
		</tr>
	</table>
</body>

</html>
	`;
}
