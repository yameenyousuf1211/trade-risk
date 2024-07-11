import { sidebarItems } from '@/utils/data';
import Link from 'next/link';
import React from 'react';

export default function Sidebar({active}:{active:number}) {

    return (
        <aside className="flex min-h-[75vh] w-64 flex-col overflow-y-auto border-r bg-white rounded-lg">
            <div className="flex flex-col items-start">
                {sidebarItems.map((item, index) => {
                    const isActive = active === item.id;
                    return (
                        <Link href={item.link} key={item.id}>
                        <div
                            className={`p-5 ${isActive ? 'border-l-2 border-l-[#5625F2] font-bold' : ''}`}
                        >
                            <p className={`opacity-90 ${isActive ? 'text-[#5625F2]' : 'text-[#696974]'}`}>
                                {item.name}
                            </p>
                        </div>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
