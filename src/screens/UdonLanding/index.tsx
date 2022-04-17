import React from 'react';
import { useIntl } from 'react-intl';

import backgroundBanner from './Landing/bg.jpg';
import Banner from './Landing/banner.svg';
import Vector from './Landing/Vector.svg';
import Soon from './Landing/Soon.svg';
import Line from './Landing/line.svg';
import LineRevert from './Landing/lineRevert.svg';
import icon1 from './Landing/products1.png';
import icon2 from './Landing/products2.png';
import icon3 from './Landing/products3.png';
import icon4 from './Landing/products4.png';
import icon5 from './Landing/products5.png';
import icon6 from './Landing/products6.png';
import phone from './Landing/phone.png';
import BannerProduct from './Landing/bannerProduct.png';
import Qs from './Landing/Q.png';
import Mark from './Landing/MaskGroup.png';
import Feture1 from './Landing/wu1.svg';
import Feture2 from './Landing/wu2.svg';
import Feture3 from './Landing/wu3.svg';
import Demo from './Landing/demo.png';
import Exdemo from './Landing/wallet_page.png';
import { QuestionCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

export const UdonLanding = () => {
	const intl = useIntl();

	const renderBanner = () => {
		return (
			<div className="landing-page__banner" style={{ backgroundImage: `url(${backgroundBanner})` }}>
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="banner-inf">
								<h2>
									{intl.formatMessage({ id: 'landing.banner.content.header.trade' })}
									<span>{intl.formatMessage({ id: 'landing.banner.content.header.crypto' })}</span>
								</h2>
								<p className="banner-inf__title">
									{intl.formatMessage({ id: 'landing.banner.content.header.anywhere' })}
								</p>
								<p className="banner-inf__des">
									{intl.formatMessage({ id: 'landing.banner.content.header.text' })}
								</p>
							</div>
						</div>
						<div className="col-md-6">
							<div className="banner-img">
								<img src={Banner} alt="Banner" style={{ width: '100%' }} />
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 d-flex">
							<div className="action-start">
								<div className="action-start__start">
									<div className="action-start__start__wrap">
										<img src={Vector} alt="Vector" />
									</div>
								</div>
								<a href="https://t.me/Wang_Jung_Udon" target="_blank">
									{intl.formatMessage({ id: 'landing.banner.content.header.startnow' })}
								</a>
							</div>
							<a className="action-view" href="https://test.udonex.com" target="_blank">
								{intl.formatMessage({ id: 'landing.banner.content.header.viewdemo' })}
							</a>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="title">
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.header.title.desc' })}
								</div>
								<img src={Line} alt="line" />
								<div className="title__content">
									<div className="title__content__text">
										{intl.formatMessage({ id: 'landing.banner.content.header.title.text' })}
									</div>
									<div className="title__content__sub">
										{intl.formatMessage({ id: 'landing.banner.content.header.title.sub' })}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="crypto-cloud">
								{intl.formatMessage({ id: 'landing.banner.content.header.title.qoute' })}
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 justify-content-end"></div>
					</div>
				</div>
			</div>
		);
	};
	const renderStepsPlan = () => {
		return (
			<div className="landing-page__steps-plan">
				<div className="container">
					<div className="step-wrap">
						<div className="content">
							<div className="step">
								<div className="step-item">
									<div className="step-item-color" style={{ backgroundColor: '#99FFE6' }}></div>
									<div className="step-item-num">- 01 -</div>
									<div className="step-item-title" style={{ color: '#99FFE6' }}>
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.title1' })}
									</div>
									<div className="step-item-des">
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.content1' })}
									</div>
								</div>
								<div className="step-item">
									<div className="step-item-color" style={{ backgroundColor: '#B79DFF' }}></div>
									<div className="step-item-num">- 02 -</div>
									<div className="step-item-title" style={{ color: '#B79DFF' }}>
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.title2' })}
									</div>
									<div className="step-item-des">
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.content2' })}
									</div>
								</div>
								<div className="step-item">
									<div className="step-item-color" style={{ backgroundColor: '#FF89D7' }}></div>
									<div className="step-item-num">- 03 -</div>
									<div className="step-item-title" style={{ color: '#FF89D7' }}>
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.title3' })}
									</div>
									<div className="step-item-des">
										{intl.formatMessage({ id: 'landing.banner.content.header.plan.content3' })}
									</div>
								</div>
							</div>
							<div className="title">
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.header.title.end.desc' })}
								</div>
								<img src={Line} alt="line" />
								<div className="title__content">
									<div className="title__content__text">
										{intl.formatMessage({ id: 'landing.banner.content.header.title.end.text' })}
									</div>
									<div className="title__content__sub">
										{intl.formatMessage({ id: 'landing.banner.content.header.title.end.sub' })}
									</div>
								</div>
							</div>
							<div className="monetize">
								<Collapse
									bordered={false}
									expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
									className="site-collapse-custom-collapse"
								>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.1' })}
										key="1"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body1' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.2' })}
										key="2"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body2' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.3' })}
										key="3"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body3' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.4' })}
										key="4"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body4' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.5' })}
										key="5"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body5' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.6' })}
										key="6"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body6' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.7' })}
										key="7"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body7' })}</p>
									</Panel>
									<Panel
										header={intl.formatMessage({ id: 'landing.banner.content.header.monetize.heading.8' })}
										key="8"
									>
										<p>{intl.formatMessage({ id: 'landing.banner.content.header.monetize.body8' })}</p>
									</Panel>
								</Collapse>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderSources = () => {
		return (
			<div className="landing-page__source">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="option-title">
								<div className="title__content">
									<div className="title__text">
										{intl.formatMessage({ id: 'landing.banner.content.package.option.text' })}
									</div>
									<div className="title__sub">
										{intl.formatMessage({ id: 'landing.banner.content.package.option.sub' })}
									</div>
								</div>
								<img src={LineRevert} alt="line" />
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.package.option.des' })}
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<div className="plans__items">
								<div className="plans__items-lable">
									<div>
										<b style={{ color: 'white', fontSize: 24 }}>
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.label1' })}
										</b>
									</div>
									<div>
										<QuestionCircleOutlined style={{ color: 'white', marginBottom: 16 }} />
									</div>
								</div>
								<div className="plans__items-content">
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.1.1' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.1.2' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.1.3' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.1.4' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.1.5' })}
										</div>
									</div>
								</div>
								<div className="plans__items-footer">
									<div className="price__action">
										<a className="price__action-click" href="https://t.me/Wang_Jung_Udon" target="_blank">
											{intl.formatMessage({
												id: 'landing.banner.content.package.option.items.policy.action',
											})}
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="plans__items best__choice">
								<div className="plans__items-lable">
									<div>
										<b style={{ color: 'white', fontSize: 24 }}>
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.label2' })}
										</b>
									</div>
									<div>
										<QuestionCircleOutlined style={{ color: 'white', marginBottom: 16 }} />
									</div>
									<div className="plans__items-lable__favourite">
										<span>BEST CHOICE</span>
									</div>
								</div>
								<div className="plans__items-content plans__items-content__best-choice">
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.2.1' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.2.2' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.2.3' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.2.4' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.2.5' })}
										</div>
									</div>
								</div>
								<div className="plans__items-footer">
									<div className="price__action">
										<a className="price__action-click" href="https://t.me/Wang_Jung_Udon" target="_blank">
											{intl.formatMessage({
												id: 'landing.banner.content.package.option.items.policy.action',
											})}
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="plans__items">
								<div className="plans__items-lable">
									<div>
										<b style={{ color: 'white', fontSize: 24 }}>
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.label3' })}
										</b>
									</div>
									<div>
										<QuestionCircleOutlined style={{ color: 'white', marginBottom: 16 }} />
									</div>
								</div>
								<div className="plans__items-content">
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.3.1' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.3.2' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.3.3' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.3.4' })}
										</div>
									</div>
									<div className="plans__items-content__ok">
										<CheckOutlined style={{ marginRight: 13, fontSize: 20, color: 'var(--yellow)' }} />
										<div className="plan__ok-text">
											{intl.formatMessage({ id: 'landing.banner.content.package.option.items.policy.3.5' })}
										</div>
									</div>
								</div>
								<div className="plans__items-footer">
									<div className="price__action">
										<a className="price__action-click" href="https://t.me/Wang_Jung_Udon" target="_blank">
											{intl.formatMessage({
												id: 'landing.banner.content.package.option.items.policy.action',
											})}
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderFeature = () => {
		return (
			<div className="landing-page__feture">
				<div className="container">
					<div className="thirdscreen">
						<div className="thirdscreen__title">
							<div className="thirdscreen__title__desc">
								{intl.formatMessage({ id: 'landing.banner.content.domain.des' })}
							</div>
							<img src={Line} alt="line" />
							<div className="thirdscreen__title__content">
								<div className="thirdscreen__title__content__text">
									{intl.formatMessage({ id: 'landing.banner.content.domain.text' })}
								</div>
								<div className="thirdscreen__title__content__sub">
									{intl.formatMessage({ id: 'landing.banner.content.domain.sub' })}
								</div>
							</div>
						</div>
						<div className="thirdscreen__main">
							<div className="row thirdscreen__main-product">
								<div className="col-md-4 thirdscreen__main-product__items">
									<img src={Banner} alt="soon" />
									<a className="items__name" href="https://t.me/Wang_Jung_Udon" target="_blank">
										{intl.formatMessage({ id: 'landing.banner.content.domain.udonex' })}
									</a>
									<div className="items__action">
										<div className="items__action-title">
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title' })}
											<br />
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title.br' })}
										</div>
										<div className="items__action-buy">
											<a
												className="items__action-buy-link"
												href="https://t.me/Wang_Jung_Udon"
												target="_blank"
											>
												{intl.formatMessage({ id: 'landing.banner.content.domain.action.buy' })}
											</a>
										</div>
									</div>
								</div>
								<div className="col-md-4 thirdscreen__main-product__items">
									<img src={Soon} alt="soon" />
									<div className="items__name">
										{intl.formatMessage({ id: 'landing.banner.content.domain.udonswap' })}
									</div>
									<div className="items__action">
										<div className="items__action-title">
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title' })}
											<br />
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title.br' })}
										</div>
										<div className="items__action-buy">
											<a
												className="items__action-buy-link"
												href="https://t.me/Wang_Jung_Udon"
												target="_blank"
											>
												{intl.formatMessage({ id: 'landing.banner.content.domain.action.buy' })}
											</a>
										</div>
									</div>
								</div>
								<div className="col-md-4 thirdscreen__main-product__items">
									<img src={Soon} alt="soon" />
									<div className="items__name">
										{intl.formatMessage({ id: 'landing.banner.content.domain.nft' })}
									</div>
									<div className="items__action">
										<div className="items__action-title">
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title' })}
											<br />
											{intl.formatMessage({ id: 'landing.banner.content.domain.action.title.br' })}
										</div>
										<div className="items__action-buy">
											<a
												className="items__action-buy-link"
												href="https://t.me/Wang_Jung_Udon"
												target="_blank"
											>
												{intl.formatMessage({ id: 'landing.banner.content.domain.action.buy' })}
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderProducts = () => {
		return (
			<div className="landing-page__products">
				<div className="container">
					<div className="forthScreen">
						<div className="forthScreen__title">
							<div className="title__content">
								<div className="title__text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.text' })}
								</div>
								<div className="title__sub">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.sub' })}
								</div>
							</div>
							<img src={LineRevert} alt="line" />
							<div className="title__desc">
								{intl.formatMessage({ id: 'landing.banner.content.more.product.des' })}
								<br />
								{intl.formatMessage({ id: 'landing.banner.content.more.product.des.br' })}
							</div>
						</div>
						<div className="forthScreen__contactus">
							<div className="forthScreen__contactus__wrap">
								<img src={phone} alt="phone" />
								<div className="contactus-text">
									<a className="contactus-text-link" href="https://t.me/Wang_Jung_Udon" target="_blank">
										{intl.formatMessage({ id: 'landing.banner.content.more.product.contact' })}
									</a>
								</div>
							</div>
						</div>
						<div className="forthScreen__more-product">
							<div className="more__product-items">
								<img className="product-items-icon" src={icon1} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.1' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.1.br' })}
								</div>
							</div>
							<div className="more__product-items">
								<img className="product-items-icon" src={icon2} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.2' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.2.br' })}
								</div>
							</div>
							<div className="more__product-items">
								<img className="product-items-icon" src={icon3} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.3' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.3.br' })}
								</div>
							</div>
							<div className="more__product-items">
								<img className="product-items-icon" src={icon4} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.4' })}
								</div>
							</div>
							<div className="more__product-items">
								<img className="product-items-icon" src={icon5} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.5' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.5.br' })}
								</div>
							</div>
							<div className="more__product-items">
								<img className="product-items-icon" src={icon6} alt="" />
								<div className="product-items-text">
									{intl.formatMessage({ id: 'landing.banner.content.more.product.item.text.6' })}
								</div>
							</div>
						</div>
						<div className="forthScreen__req">
							<div className="row">
								<div className="col-md-6">
									<img src={BannerProduct} alt="BannerProduct" />
								</div>
								<div className="col-md-6 d-flex align-items-center">
									<div className="forthScreen__req-content">
										<div className="row">
											<div className="col-md-12">
												<p className="title">
													{intl.formatMessage({
														id: 'landing.banner.content.more.product.unique.require.title',
													})}
												</p>
											</div>
											<div className="col-md-12">
												<p className="context">
													{intl.formatMessage({
														id: 'landing.banner.content.more.product.unique.require.content',
													})}
													<br />
													{intl.formatMessage({
														id: 'landing.banner.content.more.product.unique.require.content.br',
													})}
												</p>
											</div>
											<div className="col-md-12">
												<p className="rate">
													{intl.formatMessage({
														id: 'landing.banner.content.more.product.unique.require.rate',
													})}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderOption = () => {
		return (
			<div className="langding-page__option">
				<div className="container">
					<div className="row mb-5">
						<div className="col-md-12">
							<div className="option-title">
								<div className="title__content">
									<div className="title__text">
										{intl.formatMessage({ id: 'landing.banner.content.additional.option.text' })}
									</div>
									<div className="title__sub">
										{intl.formatMessage({ id: 'landing.banner.content.additional.option.sub' })}
									</div>
								</div>
								<img src={LineRevert} alt="line" />
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.additional.option.des' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.additional.option.des.br' })}
								</div>
							</div>
						</div>
					</div>
					<div className="row pt-5">
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.1' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.2' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.3' })}
							</p>
						</div>
					</div>
					<div className="row pt-5">
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.4' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.5' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.5' })}
							</p>
						</div>
					</div>
					<div className="row pt-5">
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.7' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.8' })}
							</p>
						</div>
						<div className="col-md-4 d-flex  align-items-center">
							<img className="option-qs" src={Qs} alt="Qs" />
							<p className="option-title">
								{intl.formatMessage({ id: 'landing.banner.content.additional.option.9' })}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderUs = () => {
		return (
			<div className="langding-page__us">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="option-title">
								<div className="title__content">
									<div className="title__text">
										{intl.formatMessage({ id: 'landing.banner.content.whyus.text' })}
									</div>
									<div className="title__sub">
										{intl.formatMessage({ id: 'landing.banner.content.whyus.sub' })}
									</div>
								</div>
								<img src={LineRevert} alt="line" />
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.whyus.des' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.whyus.des.br' })}
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-7">
							<img src={Mark} alt="Mark" style={{ width: '100%' }} />
							<p className="why-us__content">
								{intl.formatMessage({ id: 'landing.banner.content.whyus.content' })}
							</p>
						</div>
						<div className="col-md-5">
							<div className="feature-box ml-5">
								<div className="row">
									<div className="col-md-12">
										<div className="why-us__feture">
											<img src={Feture1} alt="feature 1" />
											<h3 className="why-us__feture__title">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.title.1' })}
											</h3>
										</div>
										<div className="why-us-content">
											<div className="why-us-content__content">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.des.1' })}
											</div>
											<p>
												<span className="why-us-content__line"></span>
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.sub.1' })}
											</p>
										</div>
									</div>
								</div>
								<div className="row mt-5 ml-3">
									<div className="col-md-12">
										<div className="why-us__feture">
											<img src={Feture2} alt="feature 2" />
											<h3 className="why-us__feture__title">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.title.2' })}
											</h3>
										</div>
										<div className="why-us-content">
											<div className="why-us-content__content">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.des.2' })}
											</div>
											<p>
												<span className="why-us-content__line"></span>
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.sub.2' })}
											</p>
										</div>
									</div>
								</div>
								<div className="row mt-5">
									<div className="col-md-12">
										<div className="why-us__feture">
											<img src={Feture3} alt="feature 3" />
											<h3 className="why-us__feture__title">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.title.3' })}
											</h3>
										</div>
										<div className="why-us-content">
											<div className="why-us-content__content">
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.des.3' })}
											</div>
											<p>
												<span className="why-us-content__line"></span>
												{intl.formatMessage({ id: 'landing.banner.content.whyus.benefit.sub.3' })}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const renderDemo = () => {
		return (
			<div className="landing-page__demo">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="option-title">
								<div className="title__desc">
									{intl.formatMessage({ id: 'landing.banner.content.demo.des' })}
									<br />
									{intl.formatMessage({ id: 'landing.banner.content.demo.des.br' })} <br />
									{intl.formatMessage({ id: 'landing.banner.content.demo.des.br.2' })}
								</div>
								<img src={Line} alt="line" />
								<div className="title__content">
									<div className="title__text">
										{intl.formatMessage({ id: 'landing.banner.content.demo.text' })}
									</div>
									<div className="title__sub">
										{intl.formatMessage({ id: 'landing.banner.content.demo.sub' })}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-4">
							<div className="demo-item">
								<img src={Exdemo} alt="demo" className="demo-item__image" />
								<h3 className="demo-item__title">
									{intl.formatMessage({ id: 'landing.banner.content.demo.title.1' })}
								</h3>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.right.1' })}
									</div>
								</div>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.right.1' })}
									</div>
								</div>
								<div className="demo-item__option d-flex justify-content-center">
									<a
										className="demo-item__option__sent-demo"
										href="https://t.me/Wang_Jung_Udon"
										target="_blank"
									>
										{intl.formatMessage({ id: 'landing.banner.content.demo.sent.demo' })}
									</a>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="demo-item">
								<img src={Demo} alt="demo" className="demo-item__image" />
								<h3 className="demo-item__title">
									{intl.formatMessage({ id: 'landing.banner.content.demo.title.2' })}
								</h3>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.right.2' })}
									</div>
								</div>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.right.2' })}
									</div>
								</div>
								<div className="demo-item__option d-flex justify-content-center">
									<a
										className="demo-item__option__sent-demo"
										href="https://t.me/Wang_Jung_Udon"
										target="_blank"
									>
										{intl.formatMessage({ id: 'landing.banner.content.demo.sent.demo' })}
									</a>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="demo-item">
								<img src={Soon} alt="demo" className="demo-item__image" />
								<h3 className="demo-item__title">
									{intl.formatMessage({ id: 'landing.banner.content.demo.title.3' })}
								</h3>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.login.right.3' })}
									</div>
								</div>
								<div className="demo-item__option">
									<div className="demo-item__option__left">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.left' })}
									</div>
									<div className="demo-item__option__mid"></div>
									<div className="demo-item__option__right">
										{intl.formatMessage({ id: 'landing.banner.content.demo.option.password.right.3' })}
									</div>
								</div>
								<div className="demo-item__option d-flex justify-content-center">
									<a
										className="demo-item__option__sent-demo"
										href="https://t.me/Wang_Jung_Udon"
										target="_blank"
									>
										{intl.formatMessage({ id: 'landing.banner.content.demo.sent.demo' })}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="landing-page">
			{renderBanner()}
			{renderStepsPlan()}
			{renderSources()}
			{renderFeature()}
			{renderProducts()}
			{renderOption()}
			{renderUs()}
			{renderDemo()}
		</div>
	);
};
