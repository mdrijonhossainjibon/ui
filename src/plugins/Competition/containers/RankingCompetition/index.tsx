import { fetchRankingCompetition, selectRankingCompetition } from 'modules';
import { EmptyData, LoadingCompetition } from 'plugins/Competition/components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cup from './assets/cup.png';
import top1 from './assets/top1.png';
import top2 from './assets/top2.png';
import top3 from './assets/top3.png';
import classNames from 'classnames';
import { upperCase } from 'lodash';
import { useIntl } from 'react-intl';
interface RankingCompetitionProps {
	competition_id: number;
	limit_display: number;
	loading: boolean;
}
export const RankingCompetition: React.FC<RankingCompetitionProps> = props => {
	const intl = useIntl();
	const { competition_id, loading } = props;
	const dispatch = useDispatch();
	const ranking = useSelector(selectRankingCompetition);
	React.useEffect(() => {
		if (!loading) dispatch(fetchRankingCompetition({ competition_id: competition_id }));
	}, [loading]);

	const renderSerialRank = (rank: number) => {
		switch (rank) {
			case 1:
				return <img src={top1} alt="top-1-image"></img>;
			case 2:
				return <img src={top2} alt="top-2-image"></img>;
			case 3:
				return <img src={top3} alt="top-3-image"></img>;
			default:
				return <React.Fragment>{rank}</React.Fragment>;
		}
	};
	const backgroundLoadingClassName = classNames('competition-background-loading');

	return (
		<div id="ranking-competition" className={`position-relative ${ranking.loading ? backgroundLoadingClassName : ''}`}>
			{ranking.loading ? <LoadingCompetition className="competition-loading col-12 position-absolute" /> : null}
			<div className="ranking-competition__winner mt-5 mb-5 col-12 d-flex flex-column justify-content-center">
				<img src={cup} alt="image-cup" className="m-auto ranking-competition__winner__logo" />
				<div className="ranking-competition__winner__uid m-auto">
					{ranking.payload.length ? ranking.payload[0].uid : ''}
				</div>
			</div>
			<div className="ranking-competition__listing">
				<div className="ranking-competition__listing__title d-flex">
					<div className="ranking-competition__listing__title__cup">
						<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M42.1642 50.309L30 46.7933L17.8358 50.309C17.7305 50.5199 17.6953 50.7308 17.6953 50.9769V58.2426H42.3047V50.9769C42.3047 50.7308 42.2695 50.5199 42.1642 50.309Z"
								fill="#646D73"
							/>
							<path
								d="M42.3047 58.2426V50.9769C42.3047 50.7308 42.2695 50.5199 42.1642 50.309L30 46.7933V58.2426H42.3047Z"
								fill="#474F54"
							/>
							<path
								d="M58.2422 3.51562H49.2604C49.2758 2.92184 49.3359 2.3625 49.3359 1.75781C49.3359 0.77332 48.5626 0 47.5781 0H12.4219C11.4374 0 10.6641 0.77332 10.6641 1.75781C10.6641 2.3625 10.7242 2.92184 10.7394 3.51562H1.75781C0.786211 3.51562 0 4.30184 0 5.27344V9.72633C0 19.5413 7.86234 27.5143 17.5515 28.0276C19.5701 30.8068 21.9657 32.8693 24.6914 34.0312C24.2695 42.5742 19.3828 48.5156 18.2228 49.7462C18.0469 49.8867 17.9062 50.0977 17.8359 50.3086H42.1642C42.0938 50.0977 41.9532 49.8867 41.7773 49.7462C40.582 48.5156 35.7305 42.6094 35.3086 34.0312C38.0348 32.8691 40.4449 30.8061 42.4651 28.0259C52.146 27.5043 60 19.5357 60 9.72633V5.27344C60 4.30184 59.2138 3.51562 58.2422 3.51562ZM3.51562 9.72633V7.03125H10.8902C11.3464 12.8412 12.6063 18.9945 15.2543 24.2236C8.6168 22.7289 3.51562 16.8097 3.51562 9.72633ZM56.4844 9.72633C56.4844 16.8061 51.3878 22.7224 44.7552 24.2205C47.3822 18.9915 48.6491 12.8978 49.1098 7.03125H56.4844V9.72633Z"
								fill="#FED843"
							/>
							<path
								d="M58.2422 3.51562H49.2604C49.2758 2.92184 49.3359 2.3625 49.3359 1.75781C49.3359 0.77332 48.5626 0 47.5781 0H30V50.3086H42.1642C42.0937 50.0977 41.9532 49.8867 41.7773 49.7462C40.582 48.5156 35.7305 42.6094 35.3086 34.0312C38.0348 32.8691 40.4449 30.8061 42.4651 28.0259C52.146 27.5043 60 19.5357 60 9.72633V5.27344C60 4.30184 59.2138 3.51562 58.2422 3.51562ZM56.4844 9.72633C56.4844 16.8061 51.3878 22.7224 44.7552 24.2205C47.3824 18.9915 48.6493 12.8978 49.1098 7.03125H56.4844V9.72633Z"
								fill="#FABE2C"
							/>
							<path
								d="M32.8056 22.3591L30.0006 20.9016L27.1956 22.3591C26.6084 22.6612 25.8909 22.6114 25.352 22.2217C24.8129 21.8303 24.5417 21.1678 24.6515 20.512L25.1666 17.3894L22.9179 15.1699C22.4284 14.6927 22.2787 13.9852 22.4784 13.3743C22.6844 12.7426 23.2303 12.2791 23.8895 12.1796L27.0137 11.7092L28.4281 8.88196C29.0256 7.69063 30.9756 7.69063 31.573 8.88196L32.9874 11.7092L36.1117 12.1796C36.7708 12.2792 37.3167 12.7427 37.5227 13.3743C37.7287 14.0077 37.5604 14.703 37.0833 15.1699L34.8345 17.3894L35.3496 20.512C35.4595 21.1678 35.1882 21.8303 34.6492 22.2217C34.1137 22.6098 33.3975 22.6671 32.8056 22.3591Z"
								fill="#FABE2C"
							/>
							<path
								d="M32.805 22.3591C33.397 22.6671 34.1133 22.6098 34.6486 22.2218C35.1876 21.8304 35.4588 21.1678 35.349 20.512L34.834 17.3894L37.0827 15.1699C37.5599 14.703 37.7281 14.0077 37.5221 13.3743C37.3161 12.7426 36.7703 12.2791 36.1111 12.1796L32.9869 11.7092L31.5724 8.88196C31.2737 8.28629 30.6369 7.9884 30 7.9884V20.9016L32.805 22.3591Z"
								fill="#FF9100"
							/>
							<path
								d="M44.0625 60H15.9375C14.9659 60 14.1797 59.2138 14.1797 58.2422C14.1797 57.2706 14.9659 56.4844 15.9375 56.4844H44.0625C45.0341 56.4844 45.8203 57.2706 45.8203 58.2422C45.8203 59.2138 45.0341 60 44.0625 60Z"
								fill="#474F54"
							/>
							<path
								d="M44.0625 56.4844H30V60H44.0625C45.0341 60 45.8203 59.2138 45.8203 58.2422C45.8203 57.2706 45.0341 56.4844 44.0625 56.4844Z"
								fill="#32393F"
							/>
						</svg>
					</div>
					<div className="ranking-competition__listing__title__limit">
						{intl.formatMessage(
							{ id: 'page.competition.detail.ranking.title' },
							{ ranking: !ranking.payload.length ? '' : ranking.payload.length },
						)}
						{/* {`Top ${!ranking.payload.length ? '' : ranking.payload.length} Rankings`} */}
					</div>
				</div>
				<div className="ranking-competition__listing__content">
					<table className="table table-dark">
						<thead>
							<tr className="text-center">
								<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.ranking.rank' })}</th>
								<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.ranking.uid' })}</th>
								<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.ranking.volume' })}</th>
								<th scope="col">{intl.formatMessage({ id: 'page.competition.detail.ranking.award' })}</th>
							</tr>
						</thead>
						<tbody>
							{ranking.payload.map((item, index) => (
								<tr key={index} className="text-center">
									<td>{renderSerialRank(item.rank)}</td>
									<td>{item.uid}</td>
									<td>{item.volume}</td>
									<td>{upperCase(item.award)}</td>
								</tr>
							))}
						</tbody>
					</table>
					{ranking.payload.length > 0 ? null : <EmptyData />}
				</div>
			</div>
		</div>
	);
};
