class ContactInfo {
    checkName() {
        const user_name = document.getElementById('nameInput');
        const regexp = /^.*[^A-zА-яЁё].*$/
        if (regexp.test(user_name.value)) {
            user_name.classList.add('is-valid')
        } else {
            user_name.classList.add('is-invalid')
        }
    }

    checkEmail() {
        const user_email = document.getElementById('emailInput');
        const regexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
        if (regexp.test(user_email.value)) {
            user_email.classList.add('is-valid')
        } else {
            user_email.classList.add('is-invalid')
        }
    }

    checkPhone() {
        const user_phone = document.getElementById('telInput');
        const regexp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/
        if (regexp.test(user_phone.value)) {
            user_phone.classList.add('is-valid')
        } else {
            user_phone.classList.add('is-invalid')
        }
    }

    validateData() {
        document.getElementById('sendContactData').addEventListener('click', (event) => {
            this.checkEmail();
            this.checkName();
            this.checkPhone()
        })
    }
}

const validation = new ContactInfo();
validation.validateData();