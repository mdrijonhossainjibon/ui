import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectChildCurrencies, selectWallets } from '../../modules';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { WalletItemProps } from '../WalletItem';

export interface CurrencyInfoProps {
	wallet: WalletItemProps;
}

interface CurrencyIconProps {
	icon?: string | null;
	currency: string;
}

const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
	return props.icon ? (
		<img style={{ borderRadius: '50%' }} alt="" className="cr-wallet-item__single__image-icon" src={props.icon} />
	) : (
		<CryptoIcon code={props.currency} />
	);
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
	const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';

	const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';

	const currency = (props.wallet || { currency: '' }).currency.toUpperCase();

	const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

	const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
	const iconUrl = props.wallet ? props.wallet.iconUrl : null;

	const wallets = useSelector(selectWallets);
	const childCurrencies = useSelector(selectChildCurrencies);
	const childCurrenciesIds = childCurrencies.map(child => child.id);
	const childWallets = wallets.filter(wallet => childCurrenciesIds.includes(wallet.currency)) || {};
	const childBalances = childWallets.map(child => Number(child.balance)) || [];
	const childLockeds = childWallets.map(child => Number(child.locked)) || [];
	const totalChildBalance = childBalances.reduce((x, y) => x + y, 0);
	const totalChildLocked = childLockeds.reduce((x, y) => x + y, 0);
	const totalBalances = Number(balance) + Number(totalChildBalance);
	const totalLocked = Number(stringLocked) + Number(totalChildLocked);

	return (
		<div className="cr-wallet-item__single">
			<CurrencyIcon icon={iconUrl} currency={currency} />
			<div className="info-grid">
				<div className="item1">
					<FormattedMessage id="page.body.wallets.balance" />
				</div>
				<div className="item2">
					<FormattedMessage id="page.body.wallets.locked" />
				</div>
				<div className="item3">
					<Decimal fixed={selectedFixed}>{totalBalances}</Decimal>
				</div>
				<div className="item4">
					<Decimal fixed={selectedFixed}>{totalLocked}</Decimal>
				</div>
			</div>
		</div>
	);
};

export { CurrencyInfo };
