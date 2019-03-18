import React, { Component } from 'react';
import { ParseApiStream, Wallet } from 'bitcore-client';
import { RouteComponentProps } from 'react-router';
import { WalletBottomNav } from '../../components/footer/BottomNav';
import { ActionCreators, store } from '../../index';
import { connect } from 'react-redux';
import { AppState } from '../../types/state';
import { socket } from '../../sockets/io';
import { WalletBar } from '../../components/activity/BalanceCard';
import { TransactionListCard } from '../../containers/transaction/TransactionContainer';

interface Props extends RouteComponentProps<{ name: string }> {
  walletName: string;
  wallet?: Wallet;
  transactions: AppState['transactions'];
  addresses: AppState['addresses'];
}

class WalletContainer extends Component<Props> {
  componentDidUpdate = async (prevProps: any) => {
    const { wallet } = this.props;
    if (wallet && prevProps.wallet !== wallet) {
      await this.fetchAddresses(wallet);
      await this.handleGetTx(wallet);
      await this.handleGetBlock(wallet);
      await this.updateWalletInfo(wallet);
    }
  };

  handleGetTx = (wallet: Wallet) => {
    socket.on('tx', () => {
      this.updateWalletInfo(wallet);
    });
  };

  handleGetBlock = (wallet: Wallet) => {
    socket.on('block', () => {
      this.updateWalletInfo(wallet);
    });
  };

  updateWalletInfo = async (wallet: Wallet) => {
    await this.fetchTransactions(wallet);
    await this.updateBalance(wallet);
  };

  updateBalance = async (wallet: Wallet) => {
    const balance = await wallet.getBalance();
    store.dispatch(ActionCreators.setBalance(balance));
  };

  fetchTransactions = async (wallet: Wallet) => {
    let prevTx = this.props.transactions.map(e => e);
    await wallet
      .listTransactions({})
      .pipe(new ParseApiStream())
      .on('data', (d: any) => {
        const foundIndex = prevTx.findIndex(
          t => t.txid === d.txid && t.outputIndex === d.outputIndex
        );
        if (foundIndex > -1) {
          prevTx[foundIndex] = d;
        } else {
          prevTx = [...prevTx, d];
        }
        console.log(d.txid);
        store.dispatch(ActionCreators.setTransactions(prevTx));
      })
      .on('finish', () => {});
  };

  fetchAddresses = async (wallet: Wallet) => {
    await wallet
      .getAddresses()
      .pipe(new ParseApiStream())
      .on('data', (d: any) => {
        let addresses = [];
        if (Array.isArray(d)) {
          addresses = d;
        } else {
          addresses = [d];
        }
        addresses.map(a =>
          store.dispatch(ActionCreators.setAddress(a.address))
        );
      });
  };

  render() {
    const txList =
      this.props.transactions.length > 10
        ? this.props.transactions.slice(0, 10)
        : this.props.transactions;
    return (
      <div>
        <WalletBar />
        <TransactionListCard transactions={txList} />
        <WalletBottomNav value={1} />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    wallet: state.wallet,
    addresses: state.addresses,
    transactions: state.transactions
  };
};

export const SingleWalletPage = connect(mapStateToProps)(WalletContainer);
