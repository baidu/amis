import React from 'react';
import {Button, InputTable, Form, Controller, InputBox} from 'amis-ui';

export default function ButtonExamples() {
  const handleSubmit = React.useCallback((data: any) => {
    console.log('submit', data);
  }, []);

  return (
    <div className="wrapper">
      <Form defaultValue={{items: [{a: 1, b: 2}]}} onSubmit={handleSubmit}>
        {({control, onSubmit}) => {
          return (
            <>
              <InputTable
                name="items"
                control={control}
                minLength={2}
                maxLength={5}
                columns={[
                  {
                    title: 'Name',
                    tdRender: ({control}) => {
                      return (
                        <Controller
                          name="key"
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
                      );
                    }
                  }
                ]}
              />
              <Button onClick={onSubmit}>Submit</Button>
            </>
          );
        }}
      </Form>
    </div>
  );
}
