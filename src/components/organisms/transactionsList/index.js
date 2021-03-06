/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

import React, { Component } from 'react'
import { Box, Text } from 'grommet'
import TransactionCard from '../../molecules/transactionCard'

class TransactionsList extends Component {
  state = { activeTransactionIndex: null }

  render () {
    const {
      numberOfTransactions,
      transactionHashes,
      loading,
      blockHeight,
      active
    } = this.props
    if (parseInt(numberOfTransactions) === 0) {
      return (
        <Text size='medium' weight='bold'>
          No transactions
        </Text>
      )
    }

    const gap = 'small'
    return (
      <Box>
        {active && (
          <Box>
            <Text onClick={this.toggleShowTransactions} as='span' color='#fff'>
              <b>transaction{transactionHashes.length > 1 && 's'}:</b>
            </Text>
          </Box>
        )}

        <Box
          style={{
            margin: '10px small 0px 15px'
          }}
        >
          {loading && (
            <Box
              pad={{ horizontal: 'xlarge', vertical: '10px' }}
              animation='pulse'
            >
              <Text alignSelf='center' size='xsmall'>
                Loading transactions...
              </Text>
            </Box>
          )}

          {transactionHashes.map((hash, index) => (
            <Box
              key={index}
              margin={{
                bottom: index !== transactionHashes.length - 1 ? gap : '0'
              }}
            >
              <TransactionCard
                transactionHash={hash}
                blockHeight={blockHeight}
                open={index === this.state.activeTransactionIndex}
                index={index}
                setActiveTransaction={this.setActiveTransactionIndex}
              />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  setActiveTransactionIndex = index => {
    if (index !== this.state.activeTransactionIndex) {
      this.setState({
        activeTransactionIndex: index
      })
    }
  }
}

export default TransactionsList
