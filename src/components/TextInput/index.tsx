import React, { forwardRef } from 'react'
import {
  Container,
  ContainerTextField,
  ContentMaskInput,
  ContainerMaskInput,
} from './styled'
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
  mask?: any
}

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<HTMLInputElement, schemaTextField>(
  (props, ref) => {
    const {
      title,
      value,
      defaultValue,
      w,
      disabled,
      helperText,
      error,
      mask,
      messageError,
      ...rest
    } = props
    return (
      <Container>
        {mask ? (
          <>
            <ContainerMaskInput style={{ width: w }}>
              {title}
              <ContentMaskInput mask={mask} ref={ref} value={value} {...rest} />
            </ContainerMaskInput>
          </>
        ) : (
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
            messageerror={messageError}
            {...rest}
            error={error}
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Container>
    )
  },
)
