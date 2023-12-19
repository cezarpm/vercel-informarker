import { Container, Text } from './styled'
import Switch from '@mui/material/Switch'
import React, { forwardRef } from 'react'

// eslint-disable-next-line react/display-name
export const SwitchInput = forwardRef<any, any>((props, ref) => {
  const { title, defaultChecked, ...rest } = props
  return (
    <Container>
      <Text>{title}</Text>
      <Switch
        title={title}
        ref={ref}
        variant="standard"
        {...rest}
        defaultChecked={defaultChecked}
      />
    </Container>
  )
})
