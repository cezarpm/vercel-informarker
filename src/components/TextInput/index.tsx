import React, { forwardRef } from 'react'
import {
  Container,
  ContainerTextField,
  ContentMaskInput,
  ContainerMaskInput,
  FormError,
} from './styled'
interface schemaTextField {
  title: string
  onChange?: any
  type?: string
  value?: string | number
  defaultValue?: any
  w?: number | string
  minW?: number | string
  messageError?: string
  disabled?: any
  helperText?: any
  error?: any
  mask?: any
  style?: any
  quantidadeCaracteres?: any
}

// eslint-disable-next-line react/display-name
export const TextInput = forwardRef<HTMLInputElement, schemaTextField>(
  (props, ref) => {
    const {
      title,
      value,
      defaultValue,
      w,
      minW,
      disabled,
      helperText,
      error,
      mask,
      messageError,
      quantidadeCaracteres,
      ...rest
    } = props
    return (
      <Container>
        {mask ? (
          <>
            <ContainerMaskInput
              style={{ width: w, color: error ? '#d32f2f' : '' }}
            >
              {title}
              <ContentMaskInput
                style={{ borderBottomColor: error ? '#d32f2f' : '' }}
                mask={mask}
                ref={ref}
                value={value}
                {...rest}
              />
              <FormError>{helperText}</FormError>
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
            sx={{ width: w, minW }}
            defaultValue={defaultValue}
            disabled={disabled}
            helperText={helperText}
            messageerror={messageError}
            {...rest}
            InputProps={{
              inputProps: {
                maxLength: quantidadeCaracteres,
              },
            }}
            error={error}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      </Container>
    )
  },
)
