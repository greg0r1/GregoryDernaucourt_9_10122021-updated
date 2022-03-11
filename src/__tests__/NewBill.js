/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from '../__mocks__/localStorage.js'
import { ROUTES } from "../constants/routes.js"
import mockStore from "../__mocks__/store"

// import "../css/bills.css"


describe("Given I am connected as an employee", () => {
  it("When I am on NewBill Page, I should be able to send a file", () => {
    const html = NewBillUI()
    document.body.innerHTML = html
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: 'cedric.hiely@billed.com'
    }))
    const storage = window.localStorage
    const store = {
      bills: jest.fn().mockImplementation(() => ({ create: jest.fn().mockImplementation(() => ({ then: jest.fn().mockImplementation(() => ({ catch: jest.fn() })) })) }))
    }
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const newbill = new NewBill({ document, onNavigate, store, storage })
    const handleChangeFile = jest.fn(newbill.handleChangeFile)
    const fileInput = screen.getByTestId('file')

    const inputData = {
      name: 'jane-roe.jpg',
      _lastModified: 1580400631732,
      get lastModified() {
        return this._lastModified
      },
      set lastModified(value) {
        this._lastModified = value
      },
      size: 703786,
      type: 'image/jpeg'
    }
    const file = screen.getByTestId('file')
    fileInput.addEventListener("change", handleChangeFile)
    fireEvent.change(file, { target: { files: [inputData] } })

    expect(handleChangeFile).toHaveBeenCalled()
  })

  it("When I am on NewBill Page, the file should not been sent if it has the wront extension", () => {
    const html = NewBillUI()
    document.body.innerHTML = html
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: 'cedric.hiely@billed.com'
    }))
    const storage = window.localStorage
    const store = {
      bills: jest.fn().mockImplementation(() => ({ create: jest.fn().mockImplementation(() => ({ then: jest.fn().mockImplementation(() => ({ catch: jest.fn() })) })) }))
    }
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const newbill = new NewBill({ document, onNavigate, store, storage })
    const handleChangeFile = jest.fn(newbill.handleChangeFile)
    const fileInput = screen.getByTestId('file')

    const inputData = {
      name: 'jane-roe.pdf',
      _lastModified: 1580400631732,
      get lastModified() {
        return this._lastModified
      },
      set lastModified(value) {
        this._lastModified = value
      },
      size: 703786,
      type: 'application/pdf'
    }
    const file = screen.getByTestId('file')
    fileInput.addEventListener("change", handleChangeFile)
    fireEvent.change(file, { target: { files: [inputData] } })

    expect(store.bills().create).not.toHaveBeenCalled()
  })

  test('Then I should submit', () => {
    const html = NewBillUI()
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee',
      email: 'cedric.hiely@billed.com'
    }))
    const storage = window.localStorage
    const store = null
    const newbill = new NewBill({ document, onNavigate, store, storage })
    const handleSubmit = jest.fn(newbill.handleSubmit)
    const formNewBill = screen.getByTestId("form-new-bill")
    formNewBill.addEventListener('submit', handleSubmit)
    fireEvent.submit(formNewBill)
    expect(handleSubmit).toHaveBeenCalled()

  })

  // Test d'intégration POST new bill
  describe("When I post a new bill", () => {
    //Date remplie
    test('I should have a valid date', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const datepicker = screen.getByTestId('datepicker')
      expect(datepicker).not.toBeNull()
      expect(datepicker.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Un montant
    test('I should have a number as amount ', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const amount = screen.getByTestId('amount')
      expect(amount).not.toBeNull()
      expect(amount.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Une tva (pourcentage)
    test('I should have a number as VAT', () => {
      const pct = screen.getByTestId('pct')
      expect(pct).not.toBeNull()
      expect(pct.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

    //Un fichier à envoyer
    test('I should have a valid file', () => {
      const file = screen.getByTestId('file')
      expect(file).not.toBeNull()
      expect(file.getAttributeNames().find(e => e == 'required')).not.toBeUndefined()
    })

  })
})
