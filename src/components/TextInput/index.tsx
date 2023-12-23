import React, { forwardRef } from 'react'
import { Container, ContainerTextField, FormErrorMessage } from './styled'
interface schemaTextField {
  title: string
  onChange?: any
  type?: string
  value?: string | number
  defaultValue?: string
  w?: number | string
  messageError?: string
  disabled?: any
  helperText?: any
  error?: any
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
      helperText,
      error,
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
          sx={{ width: w }}
          defaultValue={defaultValue}
          disabled={disabled}
          helperText={helperText}
          {...rest}
          error={error}
          InputLabelProps={{ shrink: true }}
        />
        <FormErrorMessage>{messageError}</FormErrorMessage>
      </Container>
    )
  },
)
