import { toLower, toUpper } from 'lodash';
import { selectTransactionPriceList, transactionPriceListFetch } from 'modules/plugins/transactions';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SALE_UDON_CONFIG } from 'screens/NewUdonHomePage';
import { selectCurrencies } from '../../modules';

export const ModalHomepage = props => {
	// selectors
	const currencies = useSelector(selectCurrencies);
	const transactionPrices = useSelector(selectTransactionPriceList);

	// dispatch
	const dispatch = useDispatch();

	React.useEffect(() => {
		const currencies = SALE_UDON_CONFIG.saleCurrencies.map(currency => toLower(currency));
		dispatch(transactionPriceListFetch({ currencies: currencies }));
	}, []);

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => String(currency.id).toLowerCase() === code.toLowerCase());
		try {
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	return (
		<React.Fragment>
			<div className="desktop-model-homepage">
				<div className="row desktop-model-homepage__content">
					<div className="col-lg-6">
						<h4 className="modal-body-title">How to join UDON Sale Whitelist ?</h4>
						<div className="modal-body-description">
							<ul>
								<li>1. Copy UDONEX SALE WALLET</li>
								<li>2. Sent Your BNB, USDT or BUSD to UDONEX SALE WALLET</li>
								<li>3. Your amount will auto cover to USD</li>
							</ul>
						</div>
						<span className="modal-body-node">
							Note: Only use personal wallet to sent BNB, USDT or BUSD (Metamask)
						</span>
					</div>
					<div className="col-lg-6 d-flex flex-column justify-content-space-around desktop-model-homepage__content__price">
						<div className="row desktop-model-homepage__content__price-main">
							<div className="col-lg-12 d-flex align-items-center justify-content-center">
								<div>
									<span>{SALE_UDON_CONFIG.priceText}</span>
								</div>
							</div>
						</div>
						{SALE_UDON_CONFIG.saleCurrencies.map(currency => {
							return (
								<div className="row mt-3">
									<div className="col-lg-6">
										<div className="d-flex align-items-center">
											<img
												style={{ borderRadius: '50%' }}
												width="30px"
												height="30px"
												src={findIcon(toLower(currency))}
												alt={currency}
											/>
											<span style={{ color: '#333333', marginLeft: 8, fontSize: 16 }}>
												{toUpper(currency)}
											</span>
										</div>
									</div>
									<div className="col-lg-6 d-flex align-items-center justify-content-center">
										<div>
											<span className="desktop-model-homepage__content__price-last">
												${' '}
												{transactionPrices.find(price => price.base_currency === currency)?.price ??
													'Updating'}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
