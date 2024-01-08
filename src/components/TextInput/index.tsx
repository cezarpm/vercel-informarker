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
  defaultValue?: any
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
            {...rest}
            error={error}
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Container>
    )
  },
)
