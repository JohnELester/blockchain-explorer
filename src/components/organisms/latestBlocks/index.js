import React, { Component } from 'react'
import { Box, Text } from 'grommet'
import Anchor from '../../atoms/anchor'
import BlocksList from '../../organisms/blocksList'
import { makeURLQuery } from '../../../helpers';

class LatestBlocks extends Component {
  render() {
    const { blocks } = this.props;

    return (
      <Box>
        <Box margin={{ bottom: "small" }}>
          <Text>
            <Text weight="bold">Latest Blocks</Text>
            <Text style={{float: "right"}}>
              <Anchor 
                href={`/blocks/${makeURLQuery()}`} 
                label="View all blocks"  
              />
            </Text>
          </Text>
        </Box>

        <BlocksList blocks={blocks} />
      </Box>
    );
  }
}

export default LatestBlocks;