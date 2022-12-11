import React from 'react';
import {Button, Combo, Form, Controller, InputBox} from 'amis-ui';

export default function ControlledFormExamples() {
  const [formValues, setFormValues] = React.useState<{
    a: any;
    b: any;
  }>({a: 1, b: 2});
  const handleSubmit = React.useCallback((data: any) => {
    console.log('submit', data);
  }, []);
  const handleChange = React.useCallback((values: any) => {
    setFormValues(values);
  }, []);
  const handleRandomChange = React.useCallback(() => {
    setFormValues({
      a: Math.random(),
      b: Math.random()
    });
  }, []);

  return (
    <div className="wrapper">
      <Form value={formValues} onSubmit={handleSubmit} onChange={handleChange}>
        {({control, onSubmit}) => {
          return (
            <>
              <Controller
                name="a"
                control={control}
                isRequired
                render={({field, fieldState}) => (
                  <InputBox
                    {...field}
                    placeholder="Key"
                    hasError={!!fieldState.error}
                    disabled={false}
                  />
                )}
              />

              <Controller
                name="b"
                control={control}
                isRequired
                render={({field, fieldState}) => (
                  <InputBox
                    {...field}
                    placeholder="Title"
                    hasError={!!fieldState.error}
                    disabled={false}
                  />
                )}
              />
              <Button onClick={handleRandomChange}>修改</Button>
              <Button onClick={onSubmit}>Submit</Button>
            </>
          );
        }}
      </Form>
    </div>
  );
}
