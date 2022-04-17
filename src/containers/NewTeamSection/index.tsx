import * as React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import styled from 'styled-components';

import LinkedinSVG from './assets/svg/linkedin.svg';

const ReactSlickStyle = styled.div`
	.slick-slide {
		padding-left: 20px;
	}
	.slick-slide img {
		cursor: pointer;
		transition: all 0.2s;
	}

	.slick-list [data-slick-index='0'] {
		padding-left: 0;
	}
`;

export const NewTeamSection = () => {
	const slider = React.useRef<any>({});

	const [teamImageIndexState, setTeamImageIndexState] = React.useState(0);
	const [disabledButtonState, setDisabledButtonState] = React.useState(false);

	const teams = [
		{
			large: 'https://i.imgur.com/ibxsOOc.png',
			medium: 'https://i.imgur.com/NKJh3rA.png',
			name: 'Tran Van Vinh',
			roll: 'CEO of ZoziTech and UDO Exchange',
			linkedin: 'https://www.linkedin.com/in/vinh-tran-88237620a/',
			description: '',
		},
		{
			large: 'https://i.imgur.com/719PzQu.png',
			medium: 'https://i.imgur.com/avcxjzo.png',
			name: 'Huynh Van Phuoc',
			roll: 'Blockchain and NodeJS Developer',
			linkedin: '',
			description: '',
		},
		{
			large: 'https://i.imgur.com/TRJ4uWc.jpg',
			medium: 'https://i.imgur.com/U33Yui3.jpg',
			name: 'Le Thanh Dat',
			roll: 'Blockchain and NodeJS Developer',
			linkedin: '',
			description: '',
		},
		{
			large: 'https://i.imgur.com/RcbaQlg.png',
			medium: 'https://i.imgur.com/A3Jwx10.png',
			name: 'Ngo Nhat Duy',
			roll: 'Reactjs Developer',
			linkedin: '',
			description: '',
		},
		{
			large: 'https://i.imgur.com/7KCaBrl.png',
			medium: 'https://i.imgur.com/wmXpr0l.png',
			name: 'Truong Thanh Huy',
			roll: 'Reactjs Developer',
			linkedin: '',
			description: '',
		},
		{
			large: 'https://i.imgur.com/aLnnIAY.png',
			medium: 'https://i.imgur.com/JN5pEwr.png',
			name: 'Nguyen Thi Ha Duyen',
			roll: 'Desinger',
			linkedin: '',
			description: '',
		},
	];
	const settings = {
		arrows: false,
		dots: false,
		speed: 500,
		centerMode: true,
		centerPadding: '10px',
		initialSlide: 0,
		infinity: true,
		slidesToShow: 3,
		slidesToScroll: 1,
	};

	const next = () => {
		setDisabledButtonState(true);
		setTimeout(() => {
			setDisabledButtonState(false);
		}, 1000);
		slider.current.slickNext();
		if (teamImageIndexState === teams.length - 1) {
			setTeamImageIndexState(0);
		} else {
			setTeamImageIndexState(teamImageIndexState + 1);
		}
	};

	const previous = () => {
		setDisabledButtonState(true);
		setTimeout(() => {
			setDisabledButtonState(false);
		}, 1000);
		slider.current.slickPrev();
		if (teamImageIndexState === 0) {
			setTeamImageIndexState(teams.length - 1);
		} else {
			setTeamImageIndexState(teamImageIndexState - 1);
		}
	};

	React.useEffect(() => {
		const interval = setInterval(() => {
			next();
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	});

	return (
		<div className="container" style={{ padding: '50px 0' }}>
			<div className="row">
				<div className="col-4 d-flex flex-column justify-content-end">
					<img style={{ borderRadius: '5px', width: '100%' }} src={teams[teamImageIndexState].large} alt="" />
					<div className="d-flex flex-row justify-content-between" style={{ marginTop: '4rem' }}>
						<button
							style={{
								width: '60px',
								height: '60px',
								borderRadius: '6px',
								fontSize: '2rem',
								backgroundColor: '#2FB67E',
								border: 'none',
								outline: 'none',
								color: '#fff',
							}}
							disabled={disabledButtonState}
							onClick={previous}
						>
							{'<'}
						</button>
						<div style={{ position: 'relative', width: '150px' }}>
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: '100%',
									border: '1px solid #686A75ff',
								}}
							></div>
							<div
								style={{
									position: 'absolute',
									top: '50%',
									left: '0',
									transform: 'translateY(-50%)',
									width: `${((teamImageIndexState + 1) / teams.length) * 100}%`,
									border: '1px solid #7BA6B0ff',
								}}
							></div>
							<div
								style={{
									position: 'absolute',
									top: '25%',
									left: '-5%',
									transform: 'translateY(-50%)',
									width: '110%',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<span>01</span>
								<span>{teams.length}</span>
							</div>
						</div>
						<button
							style={{
								width: '60px',
								height: '60px',
								borderRadius: '6px',
								fontSize: '2rem',
								backgroundColor: '#2FB67E',
								border: 'none',
								outline: 'none',
								color: '#fff',
							}}
							disabled={disabledButtonState}
							onClick={next}
						>
							{'>'}
						</button>
					</div>
				</div>
				<div className="col-8" style={{ paddingLeft: '50px' }}>
					<div>
						<h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Our Team</h2>
						<p style={{ fontSize: '1.3rem' }}>
							UDO Exchange, developed by ZoziTech, is a product of ZoziTech Software company.
						</p>
						<p style={{ fontSize: '1.3rem' }}>
							ZoziTech is located in Vietnam. We specialize in cryptocurrency and blockchain. We currently have over
							15 developers and 5 officers and be continuing to scale up our business.
						</p>
						<p style={{ fontSize: '1.3rem' }}>
							Our development team has extensive experience in Blockchain products, crypto exchange, CEX/DEX
							exchange.
						</p>
						<p style={{ fontSize: '1.3rem' }}>
							ZoziTech was founded by Mr. Vinh who has 6 years experience in the crypto market. He has been involved
							in the development of several Defi projects and Crypto exchanges.
						</p>
					</div>
					<hr style={{ marginLeft: 0, width: '120px', height: '3px', backgroundColor: '#2FB67E' }} />
					<div>
						<h2>{teams[teamImageIndexState].name}</h2>
						<p style={{ fontSize: '1.3rem' }}>
							{teams[teamImageIndexState].roll} |{' '}
							<span>
								<a href={teams[teamImageIndexState].linkedin}>
									<img
										width="16px"
										height="16px"
										style={{ marginRight: '5px' }}
										src={LinkedinSVG}
										alt="Linkeding"
									/>
								</a>
							</span>
						</p>
						<p style={{ fontSize: '1.3rem' }}>{teams[teamImageIndexState].description}</p>
					</div>
					<div style={{ marginTop: '40px' }}>
						<ReactSlickStyle>
							<Slider ref={slider} {...settings}>
								{teams.map((img, index) => (
									<img key={index} onClick={() => setTeamImageIndexState(index)} src={img.medium} alt="" />
								))}
							</Slider>
						</ReactSlickStyle>
					</div>
				</div>
			</div>
		</div>
	);
};
