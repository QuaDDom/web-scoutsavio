import React from 'react';
import { Card, Image, CardBody, Button, Slider } from '@nextui-org/react';

export const BranchCard = () => {
  return (
    <Card className=" dark:bg-default-100/50 max-w-[810px]">
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <Image
              isBlurred
              width={200}
              src="https://antranik.com.ar/wp-content/uploads/elementor/thumbs/unnamed-p7p8t6kl9jl80fjooloawjkc78bih9v9y8bykhha60.jpg"
            />
          </div>
          <div className="flex flex-col col-span-6 md:col-span-8">
            <h3 className="text-2xl font-bold">Manada</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eveniet ad iure
              dolores sint veniam sequi dolorum molestiae, vitae quis.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
