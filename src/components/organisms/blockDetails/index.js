import React, { Component } from 'react'
import { Box } from 'grommet'
import  BlockCard from '../../molecules/blockCard'
import { getTransactionHashes } from '../../../helpers/fetch';

class BlockDetails extends Component {
  constructor(props) {
    super(props);

    this.state = { transactionHashes: null }

    this.setTransactionHashes(props.block);
  }

  render() {
    const { transactionHashes } = this.state;
    const { block, active } = this.props;
    if (!block) {
      return null;
    }

    const data = {
      ...block,
      transactionHashes
    }

    return (
      <Box background="transparent">
        <BlockCard block={data} active={active}/>
      </Box>
    );
  }

  setTransactionHashes(block) {
    if (block && block.numberOfTransactions > 0) {
      getTransactionHashes(block.height)
      .then(transactionHashes => {
        this.setState({ transactionHashes })
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { block } = this.props;
    if(block && block.height) {
      if(!prevProps.block || block.hash !== prevProps.block.hash) {
        this.setTransactionHashes(block)
      }
    } 
  }
}

export default BlockDetails;