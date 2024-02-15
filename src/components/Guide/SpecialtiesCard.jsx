import React from 'react';
import { Card, Image, CardBody, Button, Slider } from '@nextui-org/react';

export const SpecialtiesCard = ({ img, rama, edades, enfoques, objetivos }) => {
  return (
    <Card className=" dark:bg-default-100/50 w-[80%] p-5">
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-12 items-center justify-center">
          <div className="relative col-span-6 md:col-span-3">
            <Image isBlurred width={200} src={img} />
          </div>
          <div className="flex flex-col col-span-6 md:col-span-8 gap-5">
            <h3 className="text-3xl font-bold">{rama}</h3>
            <div>
              <h4 className="font-bold text-lg">Edades:</h4>
              <div>
                <p>{edades}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg">Enfoque:</h4>
              <div>
                {enfoques.map((e) => (
                  <p>{e}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg">Objetivos:</h4>
              <div>
                {objetivos.map((e) => (
                  <p>{e}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
