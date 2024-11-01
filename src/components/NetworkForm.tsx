import networkFormSchema, {
  NetworkFormData,
} from '@/validation/networkFormSchema'
import { ChangeEvent, FC, useCallback } from 'react'
import { ControllerRenderProps, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { CirclePlus } from 'lucide-react'

const defaultSubnet = (text: string) => ({
  name: text,
  size: 1,
})

type NetworkFormProps = {
  numberOfSubnets?: number
  onSubmit?: (data: NetworkFormData) => void
}

const NetworkForm: FC<NetworkFormProps> = ({
  onSubmit,
  numberOfSubnets = 1,
}) => {
  const form = useForm<NetworkFormData>({
    resolver: zodResolver(networkFormSchema),
    defaultValues: {
      address: '',
      mask: '',
      subnets: Array.from({ length: numberOfSubnets }, (_, index) =>
        defaultSubnet(index + ''),
      ),
    },
    reValidateMode: 'onChange',
  })
  const subnetsArray = useFieldArray({ control: form.control, name: 'subnets' })

  const onSubmitForm = useCallback((data: NetworkFormData) => {
    onSubmit?.(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleMaskChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      field: ControllerRenderProps<NetworkFormData, 'mask'>,
    ) => {
      const { value } = e.target
      const isValid = /^\d*$/.test(value) && (value === '' || +value <= 32)
      field.onChange(isValid ? value : value.slice(0, -1))
    },
    [],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className='flex flex-col gap-2'
      >
        <div className='flex'>
          <FormField
            name='address'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Network Address</FormLabel>
                <div className='flex'>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <h3 className='px-2'>/</h3>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='mask'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mask</FormLabel>
                <FormControl>
                  <Input
                    size={3}
                    maxLength={2}
                    {...field}
                    onChange={(e) => handleMaskChange(e, field)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <div>Subnets</div>
          <button
            type='button'
            onClick={() =>
              subnetsArray.append(
                defaultSubnet(subnetsArray.fields.length + 1 + ''),
              )
            }
          >
            <CirclePlus />
          </button>
        </div>
        <FormField
          control={form.control}
          name='subnets'
          render={() => (
            <>
              {subnetsArray.fields.map((field, index) => (
                <FormItem key={index}>
                  <FormLabel>Subnet {index + 1}</FormLabel>
                  <FormControl>
                    <Input maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ))}
            </>
          )}
        />
        <Input type='submit' />
      </form>
    </Form>
  )
}

export default NetworkForm
