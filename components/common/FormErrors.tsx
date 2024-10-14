import { ApiErrors } from '@/libs/apis'
import clsx from 'clsx'
import * as R from "ramda"
import React from 'react'

export default function FormErrors(
  {errors, className = ""}: {errors: ApiErrors.CausedErrors, className?: string}
) {
  return !R.isEmpty(errors) && (
    <div className={clsx(className, "error")}>
      <p>Oops, something went wrong! Please check the errors below:</p>
        
      <ul className="ml-5 py-2 px-4 list-disc">
        {Object.entries(errors).map(([fieldName, errorDescriptions]) => (
          <li key={fieldName} className="py-2">
            <span>{fieldName}:</span>
            <ul className="list-square ml-2 p-1">
              {errorDescriptions.map(errorDescription => (
                <li key={errorDescription}>{errorDescription}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
