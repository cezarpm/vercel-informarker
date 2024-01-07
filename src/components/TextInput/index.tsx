import React, { forwardRef } from 'react'
import { Container, ContainerTextField, FormErrorMessage } from './styled'
interface schemaTextField {
  title: string
  onChange?: any
  type?: string
  value?: string | number
  defaultValue?: string
  w?: number | string
  minW?: number | string
  messageError?: string
  disabled?: any
}

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<HTMLInputElement, schemaTextField>(
  (props, ref) => {
    const {
      title,
      value,
      defaultValue,
      w,
      messageError,
      disabled,
      minW,
      ...rest
    } = props
    return (
      <Container>
        <ContainerTextField
          fullWidth
          id="fullWidth"
          label={title}
          ref={ref}
          variant="standard"
          value={value}
          sx={{ width: w, minW }}
          defaultValue={defaultValue}
          {...rest}
          disabled={disabled}
        />
        <FormErrorMessage>{messageError}</FormErrorMessage>
      </Container>
    )
  },
)
