"""Mario Game integration for Home Assistant."""
from __future__ import annotations

import logging
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

_LOGGER = logging.getLogger(__name__)

DOMAIN = "mario_game"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Mario Game component."""
    _LOGGER.info("Mario Game integration loaded")

    # Register the frontend resources
    hass.http.register_static_path(
        "/local/mario-game-card.js",
        hass.config.path("www/mario-game-card.js"),
        True,
    )

    return True
