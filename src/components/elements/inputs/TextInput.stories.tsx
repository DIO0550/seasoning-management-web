import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';
import { useState } from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Elements/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

// Create a wrapper component to handle state
const TextInputWithState = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <TextInput
      {...args}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        if (args.onChange) {
          args.onChange(e);
        }
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    id: 'name',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    required: false,
  },
};

export const Required: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    id: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const WithError: Story = {
  render: (args) => <TextInputWithState {...args} />,
  args: {
    id: 'username',
    name: 'username',
    label: 'Username',
    placeholder: 'Enter username',
    errorMessage: 'This username is already taken',
    required: true,
  },
};