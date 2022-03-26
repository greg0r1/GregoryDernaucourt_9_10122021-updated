import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (billUrl) => {

  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${billUrl?.indexOf('null') === -1 ? eyeBlueIcon : ''}
      </div>
      <div>
        <a href="${billUrl}" id="download" data-testid="download" data-bill-url=${billUrl} download>
      ${billUrl?.indexOf('null') === -1 ? downloadBlueIcon : ''}
        </a>
      </div>
    </div>`
  )
}