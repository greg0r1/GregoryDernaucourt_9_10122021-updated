/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from '../views/BillsUI'
import { localStorageMock } from '../__mocks__/localStorage.js'
import { ROUTES } from "../constants/routes.js"
import mockStore from "../__mocks__/store"
import store from "../app/Store"

// import "../css/bills.css"
jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  test("When I am on NewBill Page, I should be able to send a file", () => {
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

  test("When I am on NewBill Page, the file should not been sent if it has the wrong extension", () => {
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

  //Tests d'intégration POST new bill
  describe("When I valid bill form", () => {
    test('Then a bill is created', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })

      const submit = screen.queryByTestId('form-new-bill')

      const mockbill = mockStore.bills = jest.fn().mockImplementationOnce(() => {
        return {
          update: jest.fn().mockResolvedValue()
        }
      })

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

      newBill.createBill = (newBill) => newBill
      document.querySelector(`select[data-testid="expense-type"]`).value = mockbill.type
      document.querySelector(`input[data-testid="expense-name"]`).value = mockbill.name
      document.querySelector(`input[data-testid="datepicker"]`).value = mockbill.date
      document.querySelector(`input[data-testid="amount"]`).value = mockbill.amount
      document.querySelector(`input[data-testid="vat"]`).value = mockbill.vat
      document.querySelector(`input[data-testid="pct"]`).value = mockbill.pct
      document.querySelector(`textarea[data-testid="commentary"]`).value = mockbill.commentary
      newBill.fileUrl = mockbill.fileUrl
      newBill.fileName = mockbill.fileName

      submit.addEventListener('click', handleSubmit)

      fireEvent.click(submit)

      expect(handleSubmit).toHaveBeenCalled()

    })
  })

  describe("When I navigate to the newbill page, and I want to post an JPG file", () => {
    test("Then function handleChangeFile should be called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const store = {
        bills: jest.fn().mockImplementation(() => ({ create: jest.fn().mockImplementation(() => ({ then: jest.fn().mockImplementation(() => ({ catch: jest.fn() })) })) }))
      }
      const newBill = new NewBill({
        document,
        onNavigate,
        store: store,
        localStorage: window.localStorage
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const file = screen.getByTestId("file");

      file.addEventListener("change", handleChangeFile);
      fireEvent.change(file, {
        target: {
          files: [new File(["image"], "test.jpg", { type: "image/jpeg" })]
        }
      });
      expect(handleChangeFile).toHaveBeenCalled();
    })
  })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(store, "bills")
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })

      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      store.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"))
          }
        }
      })

      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
