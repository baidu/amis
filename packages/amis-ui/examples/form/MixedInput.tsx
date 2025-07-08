import React from 'react';
import {Button, InputTable, Form, Controller, MixedInput} from 'amis-ui';

export default function MixedInputExamples() {
  const handleSubmit = React.useCallback((data: any) => {
    alert(JSON.stringify(data, null, 2));
  }, []);

  const methods = React.useMemo(
    () => [
      {
        label: '%',
        pipeIn: (value: any) => {
          return value ? value.replace('%', '') : '';
        },
        pipeOut: (value: any) => {
          return value ? `${value}%` : '';
        },
        test: (value: any) => {
          return typeof value === 'string' && value.endsWith('%');
        },
        value: 'percent'
      },
      {
        label: 'px',
        type: 'number',
        inputSettings: {
          precision: 2
        },
        pipeIn: (value: any) => {
          return value ? parseFloat(value.replace('px', '')) || 0 : '';
        },
        pipeOut: (value: any) => {
          return value ? `${value}px` : '';
        },
        test: (value: any) => {
          return typeof value === 'string' && value.endsWith('px');
        },
        value: 'pixel'
      }
    ],
    []
  );

  return (
    <div className="wrapper">
      <Form defaultValue={{}} onSubmit={handleSubmit}>
        {({control, onSubmit, getValues}) => {
          return (
            <>
              <Controller
                name="a"
                control={control}
                isRequired
                render={({field, fieldState}) => (
                  <MixedInput
                    {...field}
                    hasError={!!fieldState.error}
                    disabled={false}
                    methods={methods}
                  />
                )}
              />
              <Button onClick={onSubmit}>Submit</Button>
            </>
          );
        }}
      </Form>
    </div>
  );
}
