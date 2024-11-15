import networkFormSchema, {
  NetworkFormData,
} from '@/validation/networkFormSchema'
import { FC, useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
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
import { CircleMinus } from 'lucide-react'
import { Subnet } from '@/validation/subnetSchema'
import { Button } from './ui/button'
import { FaPlus } from 'react-icons/fa'

const validateUniqueNames = (subnets: Subnet[]) => {
  const names = subnets.map((subnet) => subnet.name)
  const uniqueNames = new Set(names)
  return names.length === uniqueNames.size
}

type NetworkFormProps = Readonly<{
  numSubnets?: number
  onSubmit?: (data: NetworkFormData) => void
}>

const NetworkForm: FC<NetworkFormProps> = ({ onSubmit, numSubnets = 2 }) => {
  const form = useForm<NetworkFormData>({
    resolver: zodResolver(networkFormSchema),
    defaultValues: {
      address: '192.168.1.0',
      mask: 24,
      subnets: Array.from({ length: numSubnets }, (_, index) => ({
        name: `LAN_${index + 1}`,
        size: 20,
      })),
    },
    reValidateMode: 'onChange',
  })
  const subnetsArray = useFieldArray({ control: form.control, name: 'subnets' })
  const [error, setError] = useState<string | null>(null)

  const onSubmitForm = useCallback((data: NetworkFormData) => {
    const isValid = validateUniqueNames(data.subnets)
    if (!isValid) {
      setError('Subnet names must be unique')
      return
    }
    if (error) {
      setError(null)
    }
    onSubmit?.(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                  <Input type='number' size={3} maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <div className='flex gap-3'>
          <h3>Subnets</h3>
          <button
            type='button'
            onClick={() =>
              subnetsArray.append({
                name: `LAN_${subnetsArray.fields.length + 1}`,
                size: 20,
              })
            }
          >
            <FaPlus />
          </button>
        </div>
        <>
          {subnetsArray.fields.map((field, index) => (
            <div key={field.id} className='flex items-end gap-2'>
              <div className='flex gap-2'>
                <FormField
                  control={form.control}
                  name={`subnets.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`subnets.${index}.size`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button
                type='button'
                className='mb-2'
                onClick={() => {
                  subnetsArray.remove(index)
                }}
              >
                <CircleMinus />
              </button>
            </div>
          ))}
        </>
        <Button
          type='submit'
          className='disabled:cursor-default cursor-pointer mt-3 border border-slate-600'
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default NetworkForm
