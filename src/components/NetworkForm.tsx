import { FC } from 'react'

type NetworkFormProps = {
  onSubmit?: () => void
}

const NetworkForm: FC<NetworkFormProps> = () => {
  const handleSubmit = () => {}

  return <form onSubmit={handleSubmit}></form>
}

export default NetworkForm
