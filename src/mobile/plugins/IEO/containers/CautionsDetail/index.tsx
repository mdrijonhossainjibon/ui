import { LoadingMobile } from 'mobile/components';
import { fetchIEOCaution, selectIEOCaution } from 'modules/plugins/ieo/caution';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

export const CautionsDetail = (props: { ieoID: number }) => {
	const caution = useSelector(selectIEOCaution);
	const dispatch = useDispatch();
	const { ieoID } = props;
	const intl = useIntl();

	React.useEffect(() => {
		dispatch(fetchIEOCaution({ ieo_id: ieoID }));
	}, []);
	const loadingSpinner = () => {
		return (
			<div className="loading d-flex justify-content-center w-100">
				<LoadingMobile />
			</div>
		);
	};

	return (
		<div id="cautions-detail-mobile">
			<div className="cautions-detail-title">
				<h3>{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.cautions.title' })}</h3>
			</div>
			{caution.loading ? (
				loadingSpinner()
			) : (
				<div className="container-fluid">
					<div className="describe">
						<ul>
							<li>
								{intl.formatMessage(
									{ id: 'page.ieo.detail.buyIeo.cautions.describe.text1' },
									{ name: caution.payload.name },
								)}
							</li>
							<li>
								{intl.formatMessage(
									{ id: 'page.ieo.detail.buyIeo.cautions.describe.text2' },
									{ name: caution.payload.name },
								)}
							</li>
							<li>
								{intl.formatMessage(
									{ id: 'page.ieo.detail.buyIeo.cautions.describe.text3' },
									{ name: caution.payload.name },
								)}
							</li>

							<li>
								{intl.formatMessage(
									{ id: 'page.ieo.detail.buyIeo.cautions.describe.text4' },
									{ name: caution.payload.name },
								)}
							</li>
						</ul>
					</div>
					<div className="noticeForRate">
						<h3>{intl.formatMessage({ id: 'page.ieo.detail.buyIeo.cautions.notice' })}</h3>
						<ul>
							{!caution.error ? (
								caution.payload.notices.map((notice, index) => <li key={index}>{notice}</li>)
							) : (
								<></>
							)}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};
