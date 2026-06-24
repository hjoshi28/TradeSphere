import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${sizes[size]} glass rounded-2xl p-6 shadow-2xl transform transition-all`}>
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-bold text-surface-900">{title}</Dialog.Title>
                  <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface-50/50 flex items-center justify-center text-surface-400 hover:text-surface-800 hover:bg-surface-700/50 transition-colors cursor-pointer">
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
