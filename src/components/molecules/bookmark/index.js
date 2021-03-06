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
import { Box, Text, Button, Stack, Collapsible, TextArea } from 'grommet'
import { Trash, Notes } from 'grommet-icons'
import Anchor from '../../atoms/anchor'
// import AppNotification from '../../atoms/notification'
// import Age from '../../atoms/age'
import TruncatedText from '../../atoms/truncatedText'
import { pollForAccountUpdates } from '../../../helpers/fetch'
import { PRIMARY_LIME } from '../../../constants'
import './style.css'

const ACCCOUNT_POLL_INTERVAL = 30000 // every 1/2 minute

class Bookmark extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: props.isActive,
      showNoteForm: false,
      noteState: props.data && props.data.note,
      accountUpdates: 0
    }
  }

  render () {
    const {
      closeBookmarks,
      deleteBookmark,
      data: {
        node,
        type,
        identifier,
        url,
        note // added,
      }
    } = this.props

    const { showNoteForm, noteState, active, accountUpdates } = this.state

    return (
      <Box
        className='bookmark'
        pad='small'
        round='xsmall'
        onMouseOver={() => this.setActiveState(true)}
        onMouseOut={() => this.setActiveState(false)}
        style={{ overflow: 'hidden' }}
      >
        {/* {
          accountUpdates &&
          <AppNotification />
        } */}
        <Stack>
          <Text color='black'>
            <Text weight='bold'>
              <Anchor
                href={url}
                additionalQuery={{ node }}
                onClick={closeBookmarks}
              >
                <Text color='#000' weight='normal'>
                  {node && <Text>{node}</Text>}
                  {type && (
                    <Text>
                      <Text
                        size='large'
                        color='#f99d1c'
                        margin={{ horizontal: 'xxsmall' }}
                      >
                        /
                      </Text>
                      {type}
                    </Text>
                  )}
                  {identifier && (
                    <Text>
                      <Text size='large' color='#f99d1c'>
                        /
                      </Text>
                      <Text style={{ fontStyle: 'italic' }}>
                        <TruncatedText value={identifier} />
                      </Text>
                    </Text>
                  )}
                </Text>
              </Anchor>
            </Text>

            <Text style={{ float: 'right', opacity: active ? 1 : 0.1 }}>
              {/* <Text as="div" alignSelf="end" size="xsmall">
                <Age timestamp={added} suffix="ago"/>
              </Text> */}
              {type === 'account' && (
                <Text>
                  <Stack anchor='top-right' style={{ display: 'inline-block' }}>
                    {accountUpdates > 0 && (
                      <Box
                        background={PRIMARY_LIME}
                        pad='5px'
                        margin={{ left: 'small', bottom: 'small' }}
                        round
                        style={{ opacity: '1 !important' }}
                      >
                        {/* <Text size="xsmall">{accountUpdates}</Text> */}
                      </Box>
                    )}
                  </Stack>
                </Text>
              )}

              <Text
                margin={{ left: 'xsmall' }}
                style={{ opacity: active ? 1 : 0.1 }}
              >
                <Button
                  icon={<Notes size='20px' />}
                  onClick={this.toggleShowNoteForm}
                  plain
                />
              </Text>

              <Text
                margin={{ left: 'xsmall' }}
                style={{ opacity: active ? 1 : 0.1 }}
              >
                <Button
                  icon={<Trash size='20px' />}
                  onClick={deleteBookmark}
                  plain
                />
              </Text>
            </Text>
          </Text>
        </Stack>

        {!showNoteForm && note && (
          <Box>
            <Text color='#444' size='small'>
              {' '}
              Note: {note}
            </Text>
          </Box>
        )}

        <Collapsible open={showNoteForm}>
          <Box
            width='100%'
            border={{ color: '#999', size: 'xsmall' }}
            round='xsmall'
            // height="xxsmall"
          >
            <TextArea
              value={noteState || ''}
              onChange={this.updateNoteState}
              style={{ color: '#000' }}
              resize='vertical'
              fill
              plain
              size='small'
              onSubmit={this.submitNote}
            />
          </Box>
          <Button
            label='submit'
            style={{ textDecoration: 'underline', color: '#f99d1c' }}
            onClick={this.submitNote}
            alignSelf='center'
            plain
          />
        </Collapsible>
      </Box>
    )
  }

  toggleShowNoteForm = () => {
    this.setState(({ showNoteForm }) => {
      return { showNoteForm: !showNoteForm }
    })
  }

  updateNoteState = event => {
    const { value } = event.target

    this.setState({ noteState: value })
  }

  submitNote = () => {
    this.setState({ showNoteForm: false, noteState: null })
    this.props.updateNote(this.props.label, this.state.noteState)
  }

  setActiveState = bool => {
    this.setState({ active: bool })
  }

  notify = () => {
    this.setState({
      accountUpdates: 1
    })
    // TODO: show notification
  }

  componentDidMount = () => {
    this.startPolling()
  }

  startPolling = () => {
    this.endPolling()

    const success = history => {
      const latestAccountTxn = history && history[history.length - 1]

      if (latestAccountTxn) {
        const { latestAccountTxHash } = this.state
        if (latestAccountTxHash === latestAccountTxn.TxHash) {
          this.setState({ accountUpdated: true }, this.notify)
        }
      }
    }

    this.pollInterval = window.setInterval(
      pollForAccountUpdates({ metadata: this.props.data, success }),
      ACCCOUNT_POLL_INTERVAL
    )
  }

  endPolling = () => {
    if (this.pollInterval) {
      window.clearInterval(this.pollInterval)
    }
  }
}

export default Bookmark
