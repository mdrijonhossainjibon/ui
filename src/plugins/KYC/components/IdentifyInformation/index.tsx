import React from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import { nationalities } from 'translations/nationalities';
import { useIntl } from 'react-intl';

interface IdentifyInformationProps {
	inputChange: (key: string, value: string | Date) => void;
	dateOfBirth: Date;
	nationality: string;
	fullName: string;
}

export const IdentifyInformation = (props: IdentifyInformationProps) => {
	const { inputChange, fullName } = props;
	const [curreentDate] = React.useState(new Date());

	const dateFormat = 'YYYY/MM/DD';
	const intl = useIntl();

	const renderSelectCountry = (): any => {
		const options = [
			<option disabled key={'none'} value={'none'}>
				{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.nationally.choose' })}
			</option>,
		];
		const countries =
			nationalities &&
			nationalities.map(name => {
				const nationality = intl.formatMessage({ id: name });
				return (
					<option key={nationality} value={nationality}>
						{nationality}
					</option>
				);
			});
		return options.concat(countries);
	};
	return (
		<div className="identify__information">
			<div className="identify__information__form">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.heading' })}</h2>
				<h4>{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.title' })}</h4>
				<div className="form-group">
					<label htmlFor="name">
						{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.nationally.heading' })}
					</label>
					<div className="form-group__selected">
						<select
							className="form-group__selected__country"
							onChange={e => {
								inputChange('nationality', intl.formatMessage({ id: nationalities[e.target.selectedIndex - 1] }));
							}}
							name="nationality"
							defaultValue="none"
						>
							{renderSelectCountry()}
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.fullName' })}</label>
							<input
								type="text"
								className="form-control"
								name="fullname"
								onChange={e => inputChange('fullname', e.target.value)}
								value={fullName}
								placeholder="Enter your name"
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">
								{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.dateOfBirth' })}
							</label>
							<div className="dateOfBirth">
								<Space direction="vertical" size={12}>
									<DatePicker
										onChange={e => inputChange('date_of_birth', e ? e.toDate() : '')}
										defaultValue={moment(curreentDate, dateFormat)}
										format={dateFormat}
									/>
								</Space>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
